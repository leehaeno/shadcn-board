import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function DELETE() {
    try {
        const supabase = await createClient(); // await 추가!

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (!user || userError) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteError) {
            return NextResponse.json(
                { message: deleteError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { message: "Server crashed" },
            { status: 500 }
        );
    }
}

// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { createClient } from "@/utils/supabase/server";
// import { supabaseAdmin } from "@/utils/supabase/admin";

// export async function DELETE() {
//     try {
//         const supabase = createClient(cookies());

//         const {
//             data: { user },
//             error: userError,
//         } = await supabase.auth.getUser();

//         if (!user || userError) {
//             return NextResponse.json(
//                 { message: "Unauthorized" },
//                 { status: 401 }
//             );
//         }

//         const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

//         if (deleteError) {
//             return NextResponse.json(
//                 { message: deleteError.message },
//                 { status: 500 }
//             );
//         }

//         return NextResponse.json({ success: true });
//     } catch {
//         return NextResponse.json(
//             { message: "Server crashed" },
//             { status: 500 }
//         );
//     }
// }
