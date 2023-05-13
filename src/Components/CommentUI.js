import { useState} from "react";
import "./CommentUI.css";
function CommentUI({id , comments, onAddChildComment, onDeleteComment, onSaveComment, onEditComment}) {
  const parent = comments.find(comment => comment.id === id);
  const [inputComment, setInputComment] = useState(parent?.text);
  if(!parent) return null;
  const childrenIds = parent.childrenIds || [];
  const isEditable = parent.isEditable;
  const enableSave = inputComment && parent.text !== inputComment;
  return (
    <div className="container">
    <div key={parent.id}  style={{marginLeft: parent.style.marginLeft + "px"}} className="comment-container">
      {/* {isEditable ? <textarea value={inputComment} onChange={(e) => setInputComment(e.target.value)}/> : <div className="comment-text-div">{parent.text}</div>} */}
           <textarea value={inputComment} onChange={(e) => isEditable && setInputComment(e.target.value)}/>
            <button onClick={() => onEditComment(parent.id)}>Edit</button>
            <button onClick={() => onDeleteComment(parent.id)}>Delete</button>
            <button className={enableSave ? 'disable' : ''}onClick={(e) => onAddChildComment(e, parent)}>Reply</button>
            <button className={!enableSave ? 'disable' : ''} onClick={() => onSaveComment(parent.id, inputComment)}>Save</button>
    </div>
      {
        childrenIds.map(childId => {
          return (
            <CommentUI id={childId} onDeleteComment={onDeleteComment} key={childId} onAddChildComment={onAddChildComment} comments={comments} onSaveComment={onSaveComment} onEditComment={onEditComment}/>
          )
        })
      }
    </div>
  )
}

export default CommentUI;