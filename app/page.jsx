import LoadNovels from "@/app/components/LoadNovels";
import AddNovel from "@/app/components/AddNovel";

export default function Home() {

  return (
    <main>
        <div className={"flex justify-center lg:justify-start w-full mb-5 relative top-20"}> {/*Add novel button*/}
            <AddNovel />
        </div>

        <div className={"grid grid-cols-3 gap-10 relative top-20"}> {/*Cards layout*/}
            <LoadNovels />
        </div>

    </main>
  );
}
