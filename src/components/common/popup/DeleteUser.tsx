"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom, tasksAtom } from "@/store/atoms";
// import { createClient } from "@/utils/supabase/auth";
// import { toast } from "@/hooks/use-toast";
import { toast } from "sonner";
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
} from "@/components/ui";

interface Props {
    children: React.ReactNode;
}

function DeleteUserPopup({ children }: Props) {
    const router = useRouter();
    const user = useAtomValue(userAtom);
    const [, setUser] = useAtom(userAtom);
    const [, setTasks] = useAtom(tasksAtom);

    const handleDeleteUser = async () => {
        if (!user) return;

        try {
            /** SERVICE_ROLE_KEY ISSUE */
            const res = await fetch("/api/delete-account/", {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const { message } = await res.json();
                toast.error("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${message || "알 수 없는 오류"}`,
                });
                console.log(message);
            }
            
            setUser(null);  // jotai
            setTasks([]);  // 있으면

            /** 쿠키 값 삭제(수정에 가까움 = 기간 만료) */
            // document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "user=; path=/; max-age=0";

            // /** 로컬스토리지 및 스토어 초기화 */
            localStorage.clear();

            toast.success("회원탈퇴를 완료하였습니다.", {
                description: "TASK 관리 앱을 사용해주셔서 감사합니다!"
            });
            router.replace("/"); // push로하면 뒤로가기됨 replace 추천
            
        } catch (error) {
            /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            console.error(error);
            toast.error("네트워크 오류", {
                description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
                position: "top-center",
            });
        }
        
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>회원탈퇴를 정말 진행하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        이 작업이 실행되면 다시 취소할 수 없습니다.
                        <br /> 삭제된 계정은 영구적으로 복구되지 않습니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <button type="button" className="bg-red-600 hover:bg-rose-600" onClick={handleDeleteUser}>
                            탈퇴
                        </button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { DeleteUserPopup };
