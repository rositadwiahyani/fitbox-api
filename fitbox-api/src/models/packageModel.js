import { supabase } from "../config/supabaseClient.js";

export const PackageModel = {
    async getAll() {
        const { data, error } = await supabase.from("packages").select("*").order("calories");
        if (error) throw error;
        return data;
    },
    async getById(id) {
        const { data, error } = await supabase.from("packages").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
    },
    async create(payload) {
        const { data, error } = await supabase.from("packages").insert([payload]).select().single();
        if (error) throw error;
        return data;
    },
    async update(id, payload) {
        const { data, error } = await supabase
            .from("packages")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    async remove(id) {
        const { error } = await supabase.from("packages").delete().eq("id", id);
        if (error) throw error;
        return { message: "Paket dihapus" };
    },
};