import Header from "@/components/Header";
export default function DashboardLayout({children}){
    return(
        <main className="min-h-screen bg-white overflow-hidden w-full flex justify-center items-center dark:bg-black/90">
            <Header />
            <div className="w-full">
            {children}
            </div>
        </main>
    )
}