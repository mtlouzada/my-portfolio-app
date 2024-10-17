import '../index.css';

export default function Menu() {
    return(
        <div className="max-w-screen-lg flex justify-between items-center">
            <div className=''>
                <p>matheuslouzadaa@gmail.com</p>
                <a href="">CV</a>
            </div>
            <div>
                <a href="" className='no-underline'>LinkedIn</a>
                <a href="" className='no-underline'>GitHub</a>
            </div>
        </div>
    );
}