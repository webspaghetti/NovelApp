import LoadNovels from "@/app/components/LoadNovels";
import AddNovel from "@/app/components/AddNovel";
import FetchNovels from "@/app/components/FetchNovels";

export default function Home() {

  return (
    <main>

        <div className={"flex justify-between w-full mb-5 relative top-20"}> {/*Add novel button*/}
            <AddNovel />
            <FetchNovels />
        </div>

        <div className={'max-md:flex max-md:justify-center'}>
            <div className={"grid grid-cols-2 md:grid-cols-3 max-sm:gap-3 gap-5 md:gap-10 relative top-20 pb-9 max-md:w-100 max-md:h-100"}> {/*Cards layout*/}
                <LoadNovels />
            </div>
        </div>

    </main>
  );
}
