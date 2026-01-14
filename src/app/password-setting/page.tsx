"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { toast } from "@/hooks/use-toast";
import { toast } from "sonner";
/** UI 컴포넌트 */
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label, Input } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

function PasswordSettingPage() {
    const router = useRouter();
    /** 상태 값 */
    const [password, setPassword] = useState<string>(""); // 새 비밀번호
    const [confirmPassword, setConfirmPassword] = useState<string>(""); // 비밀번호 확인
    /** 비밀번호 보기 Toggle */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const togglePassword = () => setShowPassword((prevState) => !prevState);

    /** 비밀번호 변경 */
    const handleChangePassword = async () => {
        if (!password || !confirmPassword) {
            toast.warning("기입되지 않은 데이터(값)가 있습니다.", {
                description:"변경할 비밀번호와 비밀번호 확인은 필수 값입니다.",
                position: "top-center",
            });
            return;
        }

        if (password.length < 8) {
            toast.warning("비밀번호는 최소 8자 이상이어야 합니다.", {
                description:"우리의 정보는 소중하니까요! 보안에 신경써주세요!",
                position: "top-center",
            });
            return;
        }

        if (password !== confirmPassword) {
             toast.warning("입력한 비밀번호가 일치하지 않습니다.", {
                description:"새 비밀번호와 비밀번호 확인란에 입력한 값이 일치하는지 확인하세요!",
                position: "top-center",
            });
            return;
        }

        /** 비밀번호 변경 로직 동작 */
        try {
            const { data, error } = await supabase.auth.updateUser({ password: password });

            if (error) {
                toast.error("에러가 발생했습니다.", {
                    description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
                    position: "top-center",
                });
            } else if (data && !error) {
                toast.success("비밀번호 변경을 완료하였습니다.", {
                    //description: "이메일 주소로 비밀번호 초기화 링크를 전송했으니, 이메일을 확인하여 비밀번호를 변경하세요!",
                    position: "top-center",
                });
                router.push("/");
            }
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
        <div className="page">
            <div className="page__container">
                <Card className="w-[400px]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">비밀번호 변경</CardTitle>
                        <CardDescription>비밀번호 변경을 위해 변경할 비밀번호를 입력해주세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">새 비밀번호</Label>
                            <Input
                                className="h-12"
                                id="password1"
                                type="password"
                                placeholder="새 비밀번호를 입력하세요."
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className="relative grid gap-2">
                            <Label htmlFor="password2">비밀번호 확인</Label>
                            <Input
                                className="h-12"
                                id="password2"
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호를 다시 한 번 입력하세요."
                                required
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                            />
                            <Button
                                size={"icon"}
                                className="absolute top-[37px] right-2 -translate-y-1/4 bg-transparent hover:bg-transparent"
                                onClick={togglePassword}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                            </Button>
                        </div>
                    </CardContent>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase my-4">
                            <span className="bg-background px-2 text-muted-foreground">🍀 비밀번호가 기억나셨다면 돌아가기 버튼을 누르세요.</span>
                        </div>
                    </div>
                    <CardFooter className="w-full flex flex-col mt-2">
                        <div className="w-full flex items-center flex-col gap-4">
                            <Button variant={"outline"} className="w-full h-12" onClick={() => router.replace("/")}>
                                돌아가기
                            </Button>
                            <Button
                                className="w-full h-12 text-white bg-[#1C46F5] hover:bg-[#1C46F5] hover:ring-1 hover:ring-[#1C46F5] hover:ring-offset-1 active:bg-[#1C46F5] hover:shadow-lg"
                                onClick={handleChangePassword}
                            >
                                비밀번호 변경
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default PasswordSettingPage;
