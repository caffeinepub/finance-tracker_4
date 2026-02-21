import { RecordForm } from './components/RecordForm';
import { RecordsTable } from './components/RecordsTable';
import { FinancialSummary } from './components/FinancialSummary';
import { useFinancialRecords } from './hooks/useQueries';
import { Wallet } from 'lucide-react';

function App() {
  const { records, isLoading, addRecord, deleteRecord } = useFinancialRecords();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-terracotta shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-cream" />
            <h1 className="text-3xl font-bold text-cream">Finance Tracker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Financial Summary */}
          <section>
            <FinancialSummary records={records || []} isLoading={isLoading} />
          </section>

          {/* Add Record Form */}
          <section>
            <RecordForm onSubmit={addRecord} />
          </section>

          {/* Records Table */}
          <section>
            <RecordsTable 
              records={records || []} 
              isLoading={isLoading}
              onDelete={deleteRecord}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-sage text-cream py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'finance-tracker'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-terracotta-light transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
