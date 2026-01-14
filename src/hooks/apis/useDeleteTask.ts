"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tasksAtom, taskAtom } from "@/store/atoms";
import { useAtom } from "jotai"; 

function useDeleteTask(){
    const router = useRouter();
    const [, setTasks] = useAtom(tasksAtom);
    const [, setTask] = useAtom(taskAtom);
    const deleteTask = async(taskId: number) => {
        try{
            const {status, error} = await supabase.from("tasks").delete().eq("id", taskId);
            
            if (error) throw error;
            
            if(status === 204){ 
                toast.success("선택한 TASK가 삭제되었습니다.", {
                    description: "새로운 TASK 생기시면 언제든 추가해주세요",
                });

                // 상태에서 즉시 제거
                setTask(null);
                setTasks(prev => prev.filter(task => task.id !== taskId));
                router.replace("/task"); // 초기 페이지로 이동
            }
            // if(error){
            //     console.error("Supabase Error:", error);
            //     toast.error("에러가 발생했습니다.", {
            //         description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`
            //     });
            // } 
        } catch(error){
            console.log(error);
            toast.error("네트워크 오류", {
                description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
            });
        }
    };
    return  deleteTask ;
}
export { useDeleteTask };