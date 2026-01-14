"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import Image from "next/image";
import { taskAtom } from "@/store/atoms";
import { useAtom } from "jotai";

// 훅 Hooks
import { useGetTaskById , useCreateBoard, useGetTasks } from "@/hooks/apis";
// UI 컴포넌트
import { BoardCard, DeleteTaskPopup } from "@/components/common";
import { Button, Progress, LabelDatePicker } from "@/components/ui";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
//  CSS
import styles from "./page.module.scss";
// 타입 Types
import { Board } from "@/types/index";

function TaskPage() {
    const { id } = useParams();
    const router = useRouter();
    const [, setTask] = useAtom(taskAtom);
    const { getTasks } = useGetTasks();
    const { task } = useGetTaskById(Number(id)); // 특정 id 값에 따른 TASK 데이터
    const createBoard = useCreateBoard();
    
    /** Board Page에서 사용되는 상태값 */
    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [count, setCount] = useState<number>(0);
    const [boards, setBoards] = useState<Board[]>([]);

    // Task 내의 Board 생성
    const handleAddBoard = () => {
        const newBoard: Board = {
            id: nanoid(),
            title : "",
            startDate: undefined,
            endDate: undefined,
            content: "",
            isCompleted : false,
        };
        const newBoards = [...boards, newBoard];

        setBoards(newBoards);
        // 실제 Supabase와 통신하는 로직 Hook
        createBoard(Number(id), "boards", newBoards);
    };

    // 저장
    const handleSave = async() => {
        if(!title || !startDate || !endDate){
            toast.warning("가입되지 않은 데이터(값)가 있습니다.", {
                description: "제목, 시작일, 종료일은 필수 값입니다."
            });
            return;
        }
        
        try{
            const {data, status, error} = await supabase.from("tasks").update({
                title: title ,
                start_date: startDate,
                end_date: endDate,
            }).eq("id", id)
            .select();

            if(data !== null && status === 200){
                /** 올바르게 tasks 테이블에 row 데이터 한줄이 올바르게 생성이 되면 실행 */
                toast.success("TASK 저장을 완료하였습니다.", {
                    description: "수정한 TASK의 마감일을 꼭 지켜주세요!"
                });
                // 서버에서 데이터 갱신 후 상태값 업데이트
                // SideNavigation 검포넌트 리스트 정보를 실시간으로 업데이트 하기 위해 getTasks 함수를 호출
                getTasks();
            }

            if(error){
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

    // ui 깜빡임 문제로 다른 페이지 이동시 기존 데이터 삭제 
    useEffect(() => {
        //setTask(null);
        // let alive = true;

        // const loadTask = async () => {
        //     setTask(null); // 이전 task 제거

        //     const data = task;

        //     if (!alive) return; // ❗ 이전 요청 무시
        //     setTask(data);
        // };

        // loadTask();

        // return () => {
        //     alive = false;
        // };
    }, [id]);

    useEffect(() => {
        if(task){
            setTitle(task.title || "");
            setStartDate(task.start_date ? new Date(task.start_date) : undefined);
            setEndDate(task.end_date ? new Date(task.end_date) : undefined);
            setBoards(task.boards);
        }
    },[task])

    useEffect(() => {
        if(task?.boards){
            const completedCount = task.boards.filter((board: Board) => board.isCompleted).length;
            setCount(completedCount);
        }
    },[task?.boards])

  return (
    <>
        <div className={styles.header}>
            <div className={styles[`header__btn-box`]}>
                <Button variant={"outline"} size={"icon"} onClick={() => {router.replace("/"); setTask(null) }}>
                    <ChevronLeft />
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant={"secondary"} onClick={handleSave}>저장</Button>
                    <DeleteTaskPopup>
                        <Button className="text-rose-600 bg-red-50 hover:bg-rose-50">삭제</Button>
                    </DeleteTaskPopup>
                </div>
            </div>
            <div className={styles.header__top}>
                {/* 제목 입력 Input 섹션 */}
                <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter Title Here!" className={styles.header__top__input}/>
                {/* 진행상황 적도 그래프 섹션 */}
                <div className="flex items-center justify-start gap-4">
                    <small className="text-sm font-medium leading-none text-[#6d6d6d]">{count}/{task?.boards.length ? task?.boards.length : 0 } Completed</small>
                    <Progress className="w-60 h-[10px]" value={task && task.boards.length > 0 ? (count / task.boards.length) * 100 : 0} />
                </div>
            </div>
            {/* 캘린더 + Add New Board 버튼 섹션 */}
            <div className={styles.header__bottom}>
                <div className="flex items-center gap-5">
                    <LabelDatePicker label={"From"} value={startDate} onChange={setStartDate}/>
                    <LabelDatePicker label={"To"} value={endDate} onChange={setEndDate}/>
                </div>
                <Button className="text-white bg-[#1C46F5] hover:bg-[#1C46F5] hover:ring-1 hover:ring-[#1C46F5] hover:ring-offset-1 active:bg-[#1C46F5] hover:shadow-lg" onClick={handleAddBoard}>Add New Board</Button>
            </div>
        </div>
        <div className={styles.body}>
            {boards.length !== 0 ? (
                <div className={styles.body__isDate}>
                    {/* Add New Board 버튼 클릭으로 인한 데이터가 있을 경우 */}
                    {boards.map((board:Board) => {
                        return <BoardCard key={board.id} board={board}/>;
                    })}
                </div>
            ) : (
                <div className={styles.body__noDate}>
                    {/* Add New Board 버튼 클릭으로 인한 데이터가 없을 경우 */}
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">There is no board yet</h3>
                    <small className="text-sm font-medium leading-none text-[#6d6d6d] mt-3 mb-7">Click the button and start flashing!</small>
                    <button onClick={handleAddBoard}>
                        <Image src={"/assets/images/round-button.svg"} width={75} height={75} alt="round-button"/>
                    </button>
                </div>
            )}
        </div>
    </>
    
  )
}

export default TaskPage