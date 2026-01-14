"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
//import { toast } from "@/hooks/use-toast";
import { toast } from "sonner";
import useEmailCheck from "@/hooks/use-email";
/** UI 컴포넌트 */
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";

function SignUpPage() {
    const router = useRouter();
    const { checkEmail } = useEmailCheck();
    /** 회원가입에 필요한 상태 값 */
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    /** 비밀번호 보기 Toggle */
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const togglePassword = () => setShowPassword((prevState) => !prevState);

    const signUpNewUser = async () => {
        if (!email || !password) {
             toast.warning("기입되지 않은 데이터(값)가 있습니다.", {
                description: "이메일과 비밀번호는 필수 값입니다.",
                position: "top-center",
            });
            return; // 필수 값이 입력되지 않은 경우라면, 추가 작업은 하지 않고 리턴
        }

        if (!checkEmail(email)) {
            toast.warning("올바르지 않은 이메일 양식입니다.", {
                description: "올바른 이메일 양식을 작성해주세요!",
                position: "top-center",
            });
            return; // 이메일 형식이 잘못된 경우, 추가 작업을 하지 않고 리턴
        }

        if (password.length < 8) {
            toast.warning("비밀번호는 최소 8자 이상이어야 합니다.", {
                description: "우리의 정보는 소중하니까요! 보안에 신경쓰자구요!",
                position: "top-center",
            });
            return; // 비밀번호 길이가 8이하 일 경우, 추가 작업을 하지 않고 리턴
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                toast.error("에러가 발생했습니다.", {
                    description:  `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
                    position: "top-center",
                });
            } else if (data && !error) {
                toast.success("회원가입을 성공하였습니다.", {
                    description: "로그인 페이지로 이동하여 로그인을 진행해주세요.",
                    position: "top-center",
                });
                router.push("/"); // 로그인 페이지로 이동
            }
        } catch (error) {
            /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            console.error(error);
             toast.success("네트워크 오류", {
                description: "서버와 연결할 수 없습니다. 다시 시도해주세요",
                position: "top-center",
            });
        }
    };

    return (
        <div className="page">
            <div className="page__container">
                {/* 소개 문구 */}
                <div className="flex flex-col items-center mt-10">
                    {/* <h4 className="text-lg font-semibold">안녕하세요 👋🏻</h4> */}
                    <div className="flex flex-col items-center justify-center mt-2 mb-4">
                        <div className="text-sm text-muted-foreground">
                            <small className="text-sm text-[#1C46F5] font-medium leading-none">TASK 관리 앱</small>에 방문해주셔서 감사합니다.
                        </div>
                        <p className="text-sm text-muted-foreground">서비스를 이용하려면 회원가입을 진행해주세요.</p>
                    </div>
                </div>
                <Card className="w-[400px]">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">회원가입</CardTitle>
                        <CardDescription className="mb-2">계정을 생성하기 위해 아래 정보를 입력해주세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {/* <div className="grid gap-2">
                            <Label htmlFor="email">휴대폰 번호</Label>
                            <Input id="phone_number" placeholder="휴대폰 번호를 입력하세요." required />
                        </div> */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                className="h-12"
                                type="email"
                                placeholder="이메일을 입력하세요."
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="relative grid gap-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                className="h-12"
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호를 입력하세요."
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
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
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground my-4">간편 회원가입을 원하시면 이전 버튼을 누르세요.</span>
                        </div>
                    </div>
                    <CardFooter className="w-full flex flex-col mt-2">
                        <div className="w-full flex items-center gap-4 flex-col">
                            <Button variant={"outline"} className="w-full h-12" onClick={() => router.push("/")}>
                                이전
                            </Button>
                            <Button
                                className="w-full text-white h-12 bg-[#1C46F5] hover:bg-[#1C46F5] hover:ring-1 hover:ring-[#1C46F5] hover:ring-offset-1 active:bg-[#1C46F5] hover:shadow-lg"
                                onClick={signUpNewUser}
                            >
                                회원가입
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            이미 계정이 있으신가요?{" "}
                            <Link href={"/"} className="underline text-sm ml-1">
                                로그인
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default SignUpPage;
