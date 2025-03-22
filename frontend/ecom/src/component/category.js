// import React,{useState} from "react";
// import axios from "axios";

// const Categorys= () =>{
//     const [categories,setCategories] = useState("")
//     const getCategories = () =>{
//         const response = axios.get("http://127.0.0.1:8000/user/categories/",{
//             withCredentials:true
//         })
//         .then(response=>{console.log(response.data) 
//             setCategories(response.data)
//             console.log(categories,"cat")
//         })
//         .catch(error =>{console.log(error)});
//     }
//     return(
//         <button onClick={getCategories}>click me</button>
//     )
// }


// // export default Categorys;