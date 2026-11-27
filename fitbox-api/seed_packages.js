import dotenv from 'dotenv';
dotenv.config();
import { supabase } from './src/config/supabaseClient.js';
import { INITIAL_PACKAGES } from './src/data/packagesData.js';

export async function seedPackages() {
    console.log(`Starting to seed ${INITIAL_PACKAGES.length} packages...`);

    // 1. Fetch current packages from Supabase
    const { data: current, error: fetchErr } = await supabase.from('packages').select('id, name');
    if (fetchErr) {
        console.error('Error fetching current packages:', fetchErr);
        return;
    }

    // 2. Remove old placeholder dummy packages that are not in catalog
    const validNames = new Set(INITIAL_PACKAGES.map(p => p.name.toLowerCase()));
    const dummyPacks = (current || []).filter(p => !validNames.has(p.name.toLowerCase()));

    if (dummyPacks.length > 0) {
        console.log(`Removing ${dummyPacks.length} dummy placeholder packages:`, dummyPacks.map(d => d.name));
        for (const dummy of dummyPacks) {
            await supabase.from('packages').delete().eq('id', dummy.id);
        }
    }

    // 3. Insert missing catalog packages
    const { data: updatedCurrent } = await supabase.from('packages').select('name');
    const existingNames = new Set((updatedCurrent || []).map(p => p.name.toLowerCase()));

    const toInsert = INITIAL_PACKAGES
        .filter(p => !existingNames.has(p.name.toLowerCase()))
        .map(p => ({
            name: p.name,
            goal: p.goal,
            calories: p.calories,
            protein: p.protein,
            carbs: p.carbs,
            fats: p.fats,
            fiber: p.fiber,
            price_per_day: p.price_per_day,
            image_url: p.image_url,
            description: p.description,
            highlights: p.highlights,
            menu_sample: p.menu_sample,
        }));

    if (toInsert.length > 0) {
        console.log(`Inserting ${toInsert.length} catalog packages into DB...`);
        const { data: inserted, error: insertErr } = await supabase.from('packages').insert(toInsert).select();
        if (insertErr) {
            console.error('Error inserting packages:', insertErr);
        } else {
            console.log(`Successfully inserted ${inserted.length} packages!`);
        }
    } else {
        console.log('All catalog packages are already in the database.');
    }

    // 4. Verify count
    const { data: finalPacks } = await supabase.from('packages').select('id, name').order('name');
    console.log(`Total packages in DB: ${finalPacks?.length}`);
}

seedPackages();
