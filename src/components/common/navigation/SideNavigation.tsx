"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { userAtom } from "@/store/atoms";
// 훅 Hooks
import { useGetTasks, useCreateTask, useSearch } from "@/hooks/apis";
// UI 컴포넌트
import { Button, SearchBar } from "@/components/ui";
import { NavUser } from "./NavUser";
// 타입 Types
import { Task } from "@/types/index";

function SideNavigation() {
    const { id } = useParams();
    const router = useRouter();
    const { tasks, getTasks } = useGetTasks();
    const { search } = useSearch();
    /** 상태 값 */
    const user = useAtomValue(userAtom);
    const [searchTerm, setSearchTerm] = useState<string>("");

    //const [todos, setTodos] = useState<any>([]);

    // getTasks는 컴포넌트 최대 렌더링 시 한 번만 호출되어야 하므로 useEffect로 호출
    useEffect(() => {
        if (user?.id) {
            getTasks();
        }
    }, [user?.id, getTasks]);

    /** TASK 생성 */
    const handleCreateTask = useCreateTask();
    
    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const handleSearch = async(event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key === "Enter"){
            // useSearch 훅이 동작하도록 한다
            search(searchTerm);
        }
    };

    // useEffect(() => {
    //     test();
    // },[id])

    // const test = async () =>{
    //     let { data : tasks } = await supabase.from("tasks").select("*");
    //     setTodos(tasks);
    //     return tasks;
    // }

    return (
        <aside className="page__aside">
            <div className="flex flex-col h-full gap-3">
                {/** 검색창 UI */}
                <SearchBar placeholder="검색어를 입력하세요." onChange={handleSearchTermChange} onKeyDown={handleSearch}/>
                {/**Add New Page 버튼 UI */}
                <Button className="text-[#1C46F5] bg-white border border-[#1C46F5] hover:bg-[#f3f5ff]" onClick={handleCreateTask}>Add New Page</Button>
                {/** Task 목록 UI */}
                <div className="flex flex-col mt-4 gap-2">
                    <small className="text-sm font-medium leading-none text-[#a6a6a6]">
                        <span className="text-neutral-700">{user?.nickname ? user?.nickname : "사용자"}</span>의 TASK
                    </small>
                    <ul className="flex flex-col">
                        {tasks.length === 0 ? (
                            <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                                {/** Supabase에서 우리가 생성한 DB에 데이터가 없을 경우 */}
                                <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
                                등록된 Task가 없습니다.
                            </li>
                         ) : ( 
                            tasks.map((task:Task) => {
                                return (
                                    <li key={task.id} onClick={() => router.replace(`/task/${task.id}`)} className={`${task.id === Number(id) && "bg-[#f5f5f5]"} min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm cursor-pointer`}>
                                        <div className={`${task.id === Number(id) ? "bg-[#1C46F5]" : "bg-neutral-400"} h-[6px] w-[6px] rounded-full`}></div>
                                        <span className={`${task.id !== Number(id) && `text-neutral-400`}`}>{task.title? task.title : "등록된 제목이 없습니다."} </span>
                                    </li>
                                )
                            })
                         )}
                    </ul>
                </div>
            </div>
            <NavUser user={user} />
        </aside>
    )
}

export { SideNavigation } ;