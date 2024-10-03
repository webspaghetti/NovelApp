import CircularProgress from '@mui/material/CircularProgress';
function LoadingPopup(props) {

    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-full flex bg-navbar bg-opacity-50 justify-center items-center z-20 backdrop-blur-sm">
            <CircularProgress sx={{color: "#5e42cf"}} size={150} thickness={6}/>
        </div>
    ) : null;
}

export default LoadingPopup;