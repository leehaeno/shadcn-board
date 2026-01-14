"use client";

import { taskAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useGetTaskById } from "./useGetTaskById";
import { supabase } from "@/utils/supabase/client";
import { Board } from "@/types";

function useDeleteBoard( taskId:number, boardId: string ){
    const { getTaskById } = useGetTaskById(taskId);
    const [ task ] = useAtom(taskAtom);

    const deleteBoard = async() => {
        try{
            const { status, error } = await supabase
            .from("tasks")
            .update({
                boards: task?.boards.filter((board: Board) => board.id !== boardId),
            })
            .eq("id", taskId)
            
            if(status === 204){
                toast.success("선택한 TODO-BOARD가 삭제되었습니다.", {
                    description: "새로운 할 일이 생기시면 TODO-BOARD를 생성해주세요.",
                });
                // TASK를 갱신
                getTaskById();
            } 

            if(error){
                console.error("Supabase Error:", error);
                toast.error("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`
                });
            } 
        }catch (error) {
            console.log(error);
            toast.error("네트워크 오류", {
                description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
            });
        }

    };

    return deleteBoard;
}

export { useDeleteBoard };
