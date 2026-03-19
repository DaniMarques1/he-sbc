"use client";

import { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Sidebar />
      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen} 
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        
        {/* Content Canvas */}
        <div className="px-4 md:px-10 py-6 md:py-8 max-w-7xl mx-auto space-y-8 md:space-y-10">
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
