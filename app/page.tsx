import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SchoolData } from "@/components/SchoolData";
import { StudentData } from "@/components/StudentData";
import { ResultsTable } from "@/components/ResultsTable";
import { AcademicPath } from "@/components/AcademicPath";
import { TransferData } from "@/components/TransferData";
import { Observations } from "@/components/Observations";
import { ActionBar } from "@/components/ActionBar";

export default function HistoricoEscolar() {
  return (
    <>
      <Sidebar />
      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        <Header />
        
        {/* Content Canvas */}
        <div className="px-10 py-8 max-w-7xl mx-auto space-y-10">
          <SchoolData />
          <StudentData />
          <ResultsTable />
          <AcademicPath />
          <TransferData />
          <Observations />
          
          <ActionBar />
        </div>
      </main>
    </>
  );
}
