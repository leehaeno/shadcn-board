"us client"

import { useCallback } from "react";
import { tasksAtom, userAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "sonner";

function useGetTasks() {
    const user = useAtomValue(userAtom);
    const [tasks, setTasks] = useAtom(tasksAtom);

    /** 하단의 코드에서 Supabase에서 error를 반환함에도 불구하고 try-catch 구문을 사용하는 이유
     * async-await 구문에서 비동기 로직을 처리할 경우, try-catch는 주로 비동기 함수에서 발생할 수 있는 예외를 처리하기 위해 사용됩니다.
     * 만약, getTasks 함수 내에서 await한 API 호출이나 네트워크 요청에서 에러가 발생한다면, 그 오류는 자동으로 예외를 발생할 수 있습니다.
     * 그럴 경우, 예외를 잡아내지 않으면 프로그램이 중단되거나 예상치 못한 오류가 발생할 수 있습니다.
     */

    const getTasks = useCallback (async () => {
        if (!user?.id) {
            // 사용자가 없을 경우 데이터를 불러오지 않음
            return;
        }
        try{
            // Supabase에서 데이터 가져오기
            const {data, status, error} = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id);
            //const {data, status, error} = await supabase.from("tasks").select("*");
            // 성공적으로 데이터가 반환될 경우
            if(status === 200 && data) {
                setTasks(data)
            }else if(error){
                toast.error("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${error.message} || "알 수 없는 오류"`
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("네트워크 오류", {
                description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
            });
        }
    },[user?.id, setTasks]);
    
    return { getTasks, tasks };
}

export { useGetTasks };