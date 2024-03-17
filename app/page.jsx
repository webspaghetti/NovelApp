import LoadNovels from "@/app/components/LoadNovels";
import AddNovel from "@/app/components/AddNovel";
import FetchNovels from "@/app/components/FetchNovels";

export default function Home() {

  return (
    <main>

        <div className={"flex justify-center lg:justify-between w-full mb-5 relative top-20"}> {/*Add novel button*/}
            <AddNovel />
            <FetchNovels />
        </div>

        <div className={"grid grid-cols-3 gap-10 relative top-20 pb-9"}> {/*Cards layout*/}
            <LoadNovels />
        </div>

    </main>
  );
}
