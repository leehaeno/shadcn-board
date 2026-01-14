"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { userAtom, tasksAtom } from "@/store/atoms";
//import { toast } from "@/hooks/use-toast";
import { toast } from "sonner";
/** UI 컴포넌트 */
import { EditProfilePopup, DeleteUserPopup } from "@/components/common";
import { User2, ChevronsUpDown, LogOut, UserRoundX } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui";
import { User } from "@/types";

interface Props {
    user: User | null;
}

export function NavUser({ user }: Props) {
    const router = useRouter();
    const [, setUser] = useAtom(userAtom);
    const [, setTasks] = useAtom(tasksAtom);

    const handleLogout = async () => {
        
        setUser(null);
        setTasks([]);

        try {
            const { error } = await supabase.auth.signOut();
            
            // /** 로컬스토리지 및 스토어 초기화 */
            localStorage.clear();

            // /** 쿠키 값 삭제(수정에 가까움 = 기간 만료) */
            // // document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "user=; path=/; max-age=0";

            toast.success("로그아웃을 완료하였습니다.", {
                description: "TASK 관리 앱을 사용해주셔서 감사합니다!"
            });

            router.replace("/");

            if (error) {
                toast.error("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`
                });
            }

        } catch (error) {
            /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            console.error(error);
            toast.error("네트워크 오류", {
                description:"서버와 연결할 수 없습니다. 다시 시도해주세요!"
            });
        }
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="py-6 px-3 flex items-center justify-evenly">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.imgUrl} alt="" />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.nickname ? user?.nickname : "사용자"}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="right" align="end" sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user?.imgUrl} alt="" />
                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user?.nickname ? user?.nickname : "사용자"}</span>
                            <span className="truncate text-xs">{user?.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <EditProfilePopup>
                    <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                        {/* <EditProfilePopup> */}
                            <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                                <User2 />
                                Account
                            </div>
                        {/* </EditProfilePopup> */}
                    </DropdownMenuItem>
                </EditProfilePopup>
                <DropdownMenuSeparator />
                <DeleteUserPopup> 
                    <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                        <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                            <UserRoundX />
                            Delete Account
                        </div>
                    </DropdownMenuItem>
                </DeleteUserPopup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
