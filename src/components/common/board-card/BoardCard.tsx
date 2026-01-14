"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { taskAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
// 훅 Hooks
import { useGetTaskById, useCreateBoard, useDeleteBoard } from "@/hooks/apis";
import { toast } from "sonner";
// UI 컴포넌트
import MarkdownEditor from "@uiw/react-md-editor";
import { MarkdownEditorDialog } from "@/components/common";
import { LabelDatePicker, Separator, Button, Card, Checkbox } from "@/components/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
// 타입 Types
import { Board } from "@/types";

interface Props {
    board: Board;
}

function BoardCard({ board } : Props) {
    const { id } = useParams();
    /** TASK의 개별 TODO-BOARD 삭제(TODO-BOARD 1건 삭제) */
    const handleDeleteBoard = useDeleteBoard(Number(id), board.id);

    const [isShowContent, setIsShowContent] = useState<boolean>(false);

    const task = useAtomValue(taskAtom);
    const updateBoard = useCreateBoard();
    const { getTaskById } = useGetTaskById(Number(id));

     /** 상태 값 선언 */
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(board.startDate ? new Date(board.startDate) : undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(board.endDate ? new Date(board.endDate) : undefined);

    
    useEffect(() => {
        initState();
    },[board])

     // 등록 버튼 클릭 시
    const handleSaveBoard = async (boardId : string) => {
        if(!title){
            toast.error(" TODO-BOARD가 저장할 수 없습니다.", {
                description: "TODO-BOARD를 저장하기전 제목을 등록해주세요.",
            });  
            return;
        }

        // if(!startDate || !endDate){
        //     toast.error("기입되지 않은 데이터(값)가 있습니다.", {
        //         description: "날짜, 콘텐츠 값은 필수  값입니다. 모두 작성해주세요.",
        //     });
        //     return;
        // }

        // 해당 Board 대한 데이터만 수정이 되도록 한다.
        try{
            // board 배열에서 선택한 board를 찾고, 수정된 값으로 없데이트
            const newBoards = task?.boards.map((board:Board) => {
                if(board.id === boardId ){
                    return {...board, isCompleted, title, startDate, endDate};
                }
                return board;
            });
            await updateBoard(Number(id),"boards", newBoards);
            initState();
            getTaskById();
        } catch(error){
            // 네트워크 오류나 예기치 않은 에러를 찾기 위해 catch 구문을 사용
            toast.error("네트워크 오류", {
                description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
            })
            throw error;
        }
    };

    /** 상태 값 초기화 */
    const initState = () => {
        setIsCompleted(board.isCompleted || false);
        setTitle(board.title || "");
        setStartDate(board.startDate ? new Date(board.startDate) : undefined);
        setEndDate(board.endDate ? new Date(board.endDate) : undefined);
    };

    return (
        <Card className="w-full flex flex-col items-center p-5">
            {/* 게시물 카드 제목 영역*/}
            <div className="w-full flex items-center justify-between mb-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <Checkbox className="h-5 w-5" 
                        checked={isCompleted}
                        onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") setIsCompleted(checked);
                        }}
                    />
                    <input className="w-full text-xl outline-none bg-transparent"
                        type="text"
                        placeholder="등록된 제목이 없습니다."
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                <Button variant={"ghost"} size={"icon"} onClick={() => setIsShowContent(!isShowContent)}>
                    {isShowContent ? <ChevronUp className="text-[#6d6d6d]"/> : <ChevronDown className="text-[#6d6d6d]"/>}
                </Button>
            </div>
            {/* 캘린더 및 버튼 박스 영역 */}
            <div className="w-full flex items-center justify-between">
                {/* 캘린더 박스 */}
                <div className="flex items-center gap-5">
                    <LabelDatePicker 
                        label="From" 
                        value={startDate} 
                        onChange={setStartDate} 
                        // readonly={true}
                    />
                    <LabelDatePicker 
                        label="To" 
                        value={endDate} 
                        onChange={setEndDate} 
                        // readonly={true}
                    />
                </div>
                {/* 버튼 박스 */}
                <div className="flex items-center">
                    <Button variant={"ghost"} className="font-normal text-[#6D6D6D]" onClick={() => handleSaveBoard(board.id)}>
                        save
                    </Button>
                    <Button variant={"ghost"} className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50" onClick={handleDeleteBoard}>
                        Delete
                    </Button>
                </div>
            </div>
 	        {isShowContent &&  <MarkdownEditor preview="preview" height={320 + "px"} value={board.content ? board.content : ""} style={{ width: 100 + "%", marginTop: 16 + "px" }} />}
            <Separator className="my-3" />
            {/* Add Contents 버튼 영역 */}
            <MarkdownEditorDialog board={board}>
                <Button variant={"ghost"} className="font-normal text-[#6D6D6D]">
                    {board.title ? "Update Contents" : "Add Contents"}
                </Button>
            </MarkdownEditorDialog>
        </Card>
    );
}

export { BoardCard };