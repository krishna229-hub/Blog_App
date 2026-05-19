import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditArticle = () => {
    const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const article = location.state;

   const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // prefill form
  useEffect(() => {
    if (!article) return;

    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);
  }, [article]);

  const updateArticle = async (data) => {
    console.log(data);
  };


  return (
    <div className='p-20 text-center'>
          <h1 className='text-5xl'>Edit Article</h1>
          <form onSubmit={handleSubmit(submitHandler)} className='bg-gray-200 md:w-170 shadow rounded-2xl m-auto p-10 mt-5'>
                    
            <div className='mt-2 flex flex-col gap-2 w-full  md:w-full m-auto justify-center '>
                <input {...register("title",{required:true})} className='bg-gray-400 w-full md:w-4/5 rounded-2xl md:p-2 m-auto px-2 text-center' type="text" placeholder='title' />
                { 
                    errors.title?.type === "required" && <p className='text-red-600'>Title is required</p>
                }
                <select className='bg-gray-400 w-full md:w-4/5 rounded-2xl md:p-2 m-auto px-2 text-center' {...register("category",{required:true})} id="">
                    <option value="">Category</option>
                    <option value="programming">programming</option>
                    <option value="DSA">DSA</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="WebDev">WebDev</option>
                </select>
                { 
                    errors.category?.type === "required" && <p className='text-red-600'>category is required</p>
                }
    
                <textarea placeholder='Content' className='bg-gray-400 w-full md:w-4/5 rounded-2xl md:p-2 m-auto px-2 text-center' {...register("content",{required: true})}  id=""></textarea>
                
                { 
                    errors.content?.type === "required" && <p className='text-red-600'>{errors.content.message}</p>
                }
    
            </div>
    
            <button className='bg-blue-400 px-3 py-1 mt-2 rounded-2xl font-medium cursor-pointer' type="submit">{loading ? "Updating article" : "Update article"}</button>
    
                {
                    loading && (
                        <p className={loadingClass}>Updating Article.....</p>
                    )
                }
          </form>
        </div>
  )
}

export default EditArticle