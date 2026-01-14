"use client";

import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { tasksAtom, userAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom, useAtomValue } from "jotai";
import { useGetTasks } from "@/hooks/apis";

function useSearch() {
    const router = useRouter();
    const user = useAtomValue(userAtom);
    const { getTasks } = useGetTasks();
    const [tasks, setTasks] = useAtom(tasksAtom);

    const search = async (searchTerm: string) => {
        if (!user) return;
        if (searchTerm.trim() === "") {
            await getTasks();
            return;
        }
        else{
            try{
                const {data, status, error} = await supabase.from("tasks").select("*").eq("user_id", user.id).ilike("title", `%${searchTerm}%`);
                if(data && status === 200) setTasks(data); // Jotaidml tasksAtom 상태를 업데이트
                
                if(error){
                    toast.error("에러가 발생했습니다.", {
                        description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`
                    });
                }
                router.replace("/task");
            } catch (error){
                console.log(error);
                toast.error("네트워크 오류", {
                    description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
                });
            }
        }
    };
    return { search }; 
}

export { useSearch };