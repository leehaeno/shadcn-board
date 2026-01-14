"use client"

import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Board } from "@/types";
import { taskAtom } from "@/store/atoms";
import { useAtom } from "jotai"; 

function useCreateBoard(){
    const [, setTask] = useAtom(taskAtom);
    const createBoard = async (taskId:number, column: string, newValue: Board[] | undefined) => {
        try{
            const {data, status, error} = await supabase.from("tasks").update({
                [column]: newValue,
            })
            .eq("id", taskId)
            .select();

            if(data !== null && status === 200){
                /** 올바르게 tasks 테이블에 row 데이터 한줄이 올바르게 생성이 되면 실행 */
                toast.success("새로운 TODO-BOARD를 생성하였습니다", {
                    description: "생성한 TODO-BOARD를 알차게 채워보세요!"
                });
                setTask(data[0]);
            }

            if(error){
                console.error("Supabase Error:", error);
                toast.error("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`
                });
            }

        } catch (error){
            console.log(error);
            toast.error("네트워크 오류", {
                description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
            });
        }
    };
    return createBoard;
}

export { useCreateBoard } ;