import LoadNovels from "@/app/components/LoadNovels";

export default function Home() {

  return (
    <main>

        <div className={"flex justify-center lg:justify-start w-full mb-5"}> {/*Add novel button*/}
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add novel
            </button>
        </div>

        <div className={"grid grid-cols-3 gap-10"}> {/*Cards layout*/}
            <LoadNovels />
        </div>

    </main>
  );
}
