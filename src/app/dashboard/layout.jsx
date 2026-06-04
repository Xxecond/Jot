import Header from "@/components/Header";

export default function DashboardLayout({children}){
    return(
        <main className="min-h-screen bg-red-600 w-full flex justify-center items-center dark:bg-black/90">
            <Header />
            <div className="">
            {children}
            </div>
        </main>
    )
}