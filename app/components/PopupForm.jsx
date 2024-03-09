function PopupForm(props) {

  return (props.trigger) ? (
    <div className="fixed top-0 left-0 w-full h-full flex bg-navbar bg-opacity-20 justify-center items-center z-10 backdrop-blur-sm">
      <div className="relative p-8 w-full max-w-xl bg-navbar border-primary border-4 rounded-3xl">
        <button onClick={() => props.setTrigger(false)} className="absolute top-3 right-3 flex-shrink-0 text-sm border-4 py-1 px-2 rounded-lg border-red-700 hover:bg-red-700 text-red-700">Close</button>

          <form className={"bg-main_background p-4 rounded-lg shadow-md w-full"}>
              <div className="flex items-center border-b-2 border-primary py-2">
                  <input className="appearance-none bg-transparent border-none w-full text-secondary mr-3 px-2 leading-tight focus:outline-none select-none" type="text" placeholder="Link" aria-label="Link" />
                  <button className="flex-shrink-0 text-sm border-4 text-primary py-3 px-3 rounded-lg mb-2" type="submit">
                      Submit
                  </button>
              </div>
          </form>

      </div>
    </div>
  ) : "";
}

export default PopupForm;
