"use client";

import Link from "next/link";

function NotFoundPage() {
    return (
        <div className="page">
            <div className="page__container">
                <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                    <div className="w-full space-y-6 text-center">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl transition-transform hover:scale-110">404</h1>
                            <p className="text-gray-500">해당 게시물에 대한 접근 권한이 없습니다.</p>
                        </div>
                        <Link
                            href="/task"
                            className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                            prefetch={false}
                        >
                            돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
