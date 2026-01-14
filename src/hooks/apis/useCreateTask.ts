"use client"

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useAtom, useAtomValue } from "jotai";
import { tasksAtom, userAtom } from "@/store/atoms";

function useCreateTask(){
    const router = useRouter();
    const user = useAtomValue(userAtom);
    const [, setTasks] = useAtom(tasksAtom);

    const createTask = async () => {
        try{
            const { data, status, error} = await supabase
            .from("tasks")
            .insert([
                {   
                    user_id: user?.id,
                    title: null,
                    start_date: null,
                    end_date: null, 
                    boards: [],
                }
            ])
            .select();

            if(data && status === 201){
                 /** 올바르게 tasks 테이블에 ROW 데이터 한 줄이 올바르게 생성되면 tasksAtom에 할당한다. */
                setTasks((prevTasks) => [...prevTasks, data[0]]); // Jotai의 tasksAtom 상태 업데이트
                toast.success("새로운 TASK가 생성 되었습니다.", {
                    description: "나만의 TODO-BOARD를 생성해보세요!"
                });
                router.push(`/task/${data[0].id}`);
            }

            if(error){
                console.error("Supabase Error:", error);
                toast.error("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`
                });
            }

        } catch(error){
            console.log(error);
            toast.error("네트워크 오류", {
                description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
            });
        }
    };
    return createTask;
}

export { useCreateTask };