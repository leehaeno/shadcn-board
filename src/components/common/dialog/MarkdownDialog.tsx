"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";
// 훅 Hooks
import { useCreateBoard } from "@/hooks/apis";
import { toast } from "sonner";
// UI 컴포넌트
import MDEditor from "@uiw/react-md-editor";
import { Button, Checkbox, Dialog, LabelDatePicker, Separator, DialogDescription, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
// 타입 Types
import { Board } from "@/types";

interface Props{
    children: React.ReactNode;
    board: Board;
}

function MarkdownDialog({board, children}: Props) {
    const { id } = useParams();
    const updateBoard = useCreateBoard();
    const task = useAtomValue(taskAtom);
    /** 상태 값 선언 */;
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [content, setContent] = useState<string | undefined>("**Hello, World!!**");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    
    useEffect(() => {
        initState();
    }, [board]);

    // 등록 버튼 클릭 시
    const handleSubmit = async (boardId : string) => {
        if(!title || !content){
            toast.error("기입되지 않은 데이터(값)가 있습니다", {
                description: "제목, 콘텐츠 값은 필수  값입니다. 모두 작성해주세요."
            })
            return;
        }
        // 해당 Board 대한 데이터만 수정이 되도록 한다.
        try{
            // board 배열에서 선택한 board를 찾고, 수정된 값으로 없데이트
            const newBoards = task?.boards.map((board:Board) => {
                if(board.id === boardId ){
                    return {...board, isCompleted, title, startDate, endDate, content};
                }
                return board;
            });
            await updateBoard(Number(id),"boards", newBoards);
            handleCloseDialog();
        } catch(error){
            // 네트워크 오류나 예기치 않은 에러를 찾기 위해 catch 구문을 사용
            toast.error("네트워크 오류", {
                description: "서버와 연결 할 수 없습니다. 다시 시도해주세요!"
            })
            throw error;
        }
    };

    // 다이얼로그 닫기
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        initState();
    };

    // 상태 값 초기화
    const initState = () => {
        setIsCompleted(board.isCompleted || false);
        setTitle(board.title || "");
        setStartDate(board.startDate ? new Date(board.startDate) : undefined);
        setEndDate(board.endDate ? new Date(board.endDate) : undefined);
        setContent(board.content || "**Hello, World!!**")
    };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    <div className="flex items-center justify-start gap-2">
                        <Checkbox 
                            className="w-5 min-w-5 h-5" 
                            checked={isCompleted} 
                            onCheckedChange={(checked) => {
                            if(typeof checked === "boolean") setIsCompleted(checked);
                        }}/>
                        <input type="text" placeholder="게시물의 제목을 입력하세요." className="w-full text-xl outline-none bg-transparent" value={title} onChange={(event)=> setTitle(event.target.value)} />
                    </div>
                </DialogTitle>
                <DialogDescription>마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.</DialogDescription>
            </DialogHeader>
            {/** 캘린더 박스 */}
            <div className="flex items-center gap-5">
                {/* <LabelDatePicker label="From" value={startDate} onChange={setStartDate}/>
                <LabelDatePicker label="To" value={endDate} onChange={setEndDate}/> */}
                <LabelDatePicker label="From" value={startDate} readonly={true}/>
                <LabelDatePicker label="To" value={endDate} readonly={true}/>
            </div>
            <Separator />
            {/** 마크다운 에디터 UI 영역 */}
            <MDEditor height={320 + "px"} value={content} onChange={setContent}/>
            <DialogFooter> 
                <DialogClose asChild>
                    <Button variant={"outline"}>취소</Button>
                </DialogClose>
                <Button type={"submit"} className="font-normal text-white bg-[#1C46F5] hover:bg-[#1C46F5] hover:ring-1 hover:ring-[#1C46F5] hover:ring-offset-1 active:bg-[#1C46F5] hover:shadow-lg" onClick={() => handleSubmit(board.id)}>등록</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
export { MarkdownDialog };