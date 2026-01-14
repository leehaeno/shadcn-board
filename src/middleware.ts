import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

const getTask = async (taskId: number, userId: string) => {
    const supabase = await createClient()
    /** 사용자 ID를 기준으로 TASK를 조회 */
    /** 여기서 userId는 로그인한 계정의 user_id */
    const { data, status, error } = await supabase.from("tasks").select("*").eq("user_id", userId).eq("id", taskId);

    if (data && status === 200) return data[0];
    if (error) throw error;

    return null;
};

export async function middleware(request: NextRequest) {

    /** 로그인 페이지 접근 차단: LocalStorage 대신 쿠키로 로그인 여부 확인 */
    const user = request.cookies.get("user"); // 쿠키에서 user 정보 확인 (예: 서버에서 쿠키로 사용자 정보 전달)

    /** 사용자가 로그인 상태일 때, 로그인 페이지에 접근하면 리다이렉트 */
    if (request.nextUrl.pathname === "/" && user) {
        /** 로그인 상태이면 콘텐츠 페이지로 리다이렉트 */
        return NextResponse.redirect(new URL("/task", request.url));
    }

    /** 사용자가 로그인 되지 않았을 경우, /board 페이지 같은 콘텐츠 페이지 접근했을 시 로그인 페이지로 리다이렉트 */
    if (request.nextUrl.pathname.startsWith("/task") && !user) {
        /** 비로그인 상태이면 로그인 페이지로 리다이렉트 */
        return NextResponse.redirect(new URL("/", request.url));
    }

    /** 사용자가 로그인이 된 경우, /board/:path* 경로와 같은 콘텐츠 페이지에 접근했을 시
     * 로그인된 유저의 task가 아니면 not-found 페이지로 리다이렉트
     *
     * 1. 로그인된 사용자가 특정 task를 조회하려는 경우, task의 id 확인 */
    if (request.nextUrl.pathname.startsWith("/task/")) {
        const taskId = parseInt(request.nextUrl.pathname.split("/task/")[1], 10);

        // 1. taskId가 유효하지 않으면 에러 처리
        if (isNaN(taskId)) {
            return NextResponse.redirect(new URL("/", request.url)); // 잘못된 taskId로 접근할 때, 로그인 페이지로 리다이렉트
        }

        // 2. 사용자가 로그인 상태인 경우, 해당 task가 본인의 것인지 체크
        if (user) {
            const task = await getTask(taskId, JSON.parse(user.value).id); // 로그인된 사용자의 task만 조회

            if (!task) {
                return NextResponse.redirect(new URL("/not-found", request.url)); // 사용자가 해당 task에 접근할 수 없으면 /not-found로 리다이렉트
            }
        }
    }
    /** 기본적인 요청을 그대로 진행 */
    return NextResponse.next();
}

/** 미들웨어가 적용될 경로를 설정(모든 경로에 미들웨어 적용) */
export const config = {
    matcher: ["/", "/task/:path*"],
};



///



// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createClient } from "@/utils/supabase/server";
// import { cookies } from "next/headers";

// const getTask = async (taskId: number, userId: string) => {
//     const cookieStore = cookies();
//     const supabase = createClient(cookieStore);
//     /** 사용자 ID를 기준으로 TASK를 조회 */
//     /** 여기서 userId는 로그인한 계정의 user_id */
//     const { data, status, error } = await supabase.from("tasks").select("*").eq("user_id", userId).eq("id", taskId);

//     if (data && status === 200) return data[0];
//     if (error) throw error;

//     return null;
// };

// export async function middleware(request: NextRequest) {

//     /** 로그인 페이지 접근 차단: LocalStorage 대신 쿠키로 로그인 여부 확인 */
//     const user = request.cookies.get("user"); // 쿠키에서 user 정보 확인 (예: 서버에서 쿠키로 사용자 정보 전달)

//     /** 사용자가 로그인 상태일 때, 로그인 페이지에 접근하면 리다이렉트 */
//     if (request.nextUrl.pathname === "/" && user) {
//         /** 로그인 상태이면 콘텐츠 페이지로 리다이렉트 */
//         return NextResponse.redirect(new URL("/task", request.url));
//     }

//     /** 사용자가 로그인 되지 않았을 경우, /board 페이지 같은 콘텐츠 페이지 접근했을 시 로그인 페이지로 리다이렉트 */
//     if (request.nextUrl.pathname.startsWith("/task") && !user) {
//         /** 비로그인 상태이면 로그인 페이지로 리다이렉트 */
//         return NextResponse.redirect(new URL("/", request.url));
//     }

//     /** 사용자가 로그인이 된 경우, /board/:path* 경로와 같은 콘텐츠 페이지에 접근했을 시
//      * 로그인된 유저의 task가 아니면 not-found 페이지로 리다이렉트
//      *
//      * 1. 로그인된 사용자가 특정 task를 조회하려는 경우, task의 id 확인 */
//     if (request.nextUrl.pathname.startsWith("/task/")) {
//         const taskId = parseInt(request.nextUrl.pathname.split("/task/")[1], 10);

//         // 1. taskId가 유효하지 않으면 에러 처리
//         if (isNaN(taskId)) {
//             return NextResponse.redirect(new URL("/", request.url)); // 잘못된 taskId로 접근할 때, 로그인 페이지로 리다이렉트
//         }

//         // 2. 사용자가 로그인 상태인 경우, 해당 task가 본인의 것인지 체크
//         if (user) {
//             const task = await getTask(taskId, JSON.parse(user.value).id); // 로그인된 사용자의 task만 조회

//             if (!task) {
//                 return NextResponse.redirect(new URL("/not-found", request.url)); // 사용자가 해당 task에 접근할 수 없으면 /not-found로 리다이렉트
//             }
//         }
//     }
//     /** 기본적인 요청을 그대로 진행 */
//     return NextResponse.next();
// }

// /** 미들웨어가 적용될 경로를 설정(모든 경로에 미들웨어 적용) */
// export const config = {
//     matcher: ["/", "/task/:path*"],
// };
