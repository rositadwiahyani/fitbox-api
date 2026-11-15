import { supabase } from "../config/supabaseClient.js";

export const OrderModel = {
    async getByDevice(deviceId) {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("device_id", deviceId)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    },
    async getById(id) {
        const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
    },
    async create(payload) {
        const { data, error } = await supabase.from("orders").insert([payload]).select().single();
        if (error) throw error;
        return data;
    },
    async update(id, payload) {
        const { data, error } = await supabase
            .from("orders")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    async remove(id) {
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (error) throw error;
        return { message: "Pesanan dibatalkan" };
    },
};