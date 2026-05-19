import React from 'react'
import { tagClass, articleTitle, articleExcerpt, articleMeta } from '../styles/common'
import { useNavigate } from 'react-router'

const Card = ({articleObj}) => {
    const navigate = useNavigate();
    const handleReadArticle = () => {
        navigate(`/article/${articleObj._id}`,
          {state:{articleObj:articleObj}})
    }

  return (
    <div className='bg-[#f5f5f7] rounded-2xl p-6 flex flex-col gap-3 hover:bg-[#ebebf0] transition-colors duration-200 cursor-pointer group'
         onClick={handleReadArticle}
    >
      {/* Category tag */}
      <span className={tagClass}>{articleObj.category}</span>

      {/* Title */}
      <h3 className={articleTitle}>{articleObj.title}</h3>

      {/* Excerpt */}
      <p className={articleExcerpt}>
        {articleObj.content.substring(0, 80)}{articleObj.content.length > 80 ? "..." : ""}
      </p>

      {/* Author & date */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-center gap-2">
          {articleObj.author?.profileImageUrl ? (
            <img
              src={articleObj.author.profileImageUrl}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#0066cc] flex items-center justify-center text-[10px] font-bold text-white">
              {articleObj.author?.firstName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <span className={articleMeta}>
            {articleObj.author?.firstName || "Unknown"} {articleObj.author?.lastName || ""}
          </span>
        </div>
        <span className={articleMeta}>
          {new Date(articleObj.createdAt || articleObj.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Read link */}
      <span className="text-[#0066cc] text-xs font-medium group-hover:text-[#004499] transition-colors">
        Read article →
      </span>
    </div>
  )
}

export default Card