"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import useEmailCheck from "@/hooks/use-email";
/** UI 컴포넌트 */
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger, 
    Label,
    Input,
} from "@/components/ui"; 

interface Props {
    children: React.ReactNode;
}

function FindPasswordPopup({ children }: Props) {
    const { checkEmail } = useEmailCheck();
    const [email, setEmail] = useState<string>("");
    const handleSendConfirmEmail = async () => {
        
        if (!email) {
            toast.warning("기입되지 않은 데이터(값)가 있습니다.", {
                description:"비밀번호 초기화 이메일을 전송받을 이메일을 작성해주세요.",
                position: "top-center",
            });
            return;
            
        }

        if (!checkEmail(email)) {
            toast.warning("올바르지 않은 이메일 양식입니다.", {
                description: "올바른 이메일 양식을 작성해주세요!",
                position: "top-center",
            });
            return; // 이메일 형식이 잘못된 경우, 추가 작업을 하지 않고 리턴
        }

        try {
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "http://hyho-shadcn-board.vercel.app/password-setting",
            });
            toast.success("비밀번호 초기화 이메일을 전송했습니다.", {
                description: "이메일 주소로 비밀번호 초기화 링크를 전송했으니, 이메일을 확인하여 비밀번호를 변경하세요!",
                position: "top-center",
            });
        } catch (error) {
            /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            console.error(error);
            toast.error("네트워크 오류.", {
                description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
                position: "top-center",
            });
        }
    };

    return (
        <AlertDialog >
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>비밀번호를 잊으셨나요?</AlertDialogTitle>
                    <AlertDialogDescription>비밀번호 초기화를 위해 본인의 이메일 주소를 하단에 기입해주세요.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="findEmail">이메일</Label>
                    <Input
                        id="findEmail"
                        type="email"
                        placeholder="이메일을 입력하세요."
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction className="bg-[#1C46F5] hover:bg-[#1C46F5] hover:ring-1 hover:ring-[#1C46F5] hover:ring-offset-1 active:bg-[#1C46F5] hover:shadow-lg" onClick={handleSendConfirmEmail}>
                        전송
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { FindPasswordPopup };
