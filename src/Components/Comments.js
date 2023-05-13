

import { useState } from "react";
import CommentUI from "./CommentUI";

let ID = 1;
const CHILD_MARGIN_LEFT = 20;

 function getCommentObject({text, id, parentId, childrenIds, style = {marginLeft: 0}, isEditable=false}) {
   return {
     text,
     id,
     parentId,
     childrenIds,
     style,
     isEditable
   }
 }


function AllComments() {
  const [newTopLevelComment, setNewTopLevelComment] = useState({text: ""}); // Add Top level comment
  const [comments, setComments] = useState([]); // All comments
  const handleNewTopLevelComment = (e) => {
    const comment = getCommentObject({
      text: e.target.value,
      parentId: -1,
      id: ID++,
      childrenIds: []
    })
    setNewTopLevelComment(comment);
  }
  const handleCommentSubmit = (e) => {
      e.preventDefault();
      setComments([
        newTopLevelComment,
        ...comments,
      ])
      setNewTopLevelComment({text: ""})
  }
  // Add Comment from the comment List
  const handleAddChildComment = (e, parentComment) => {
    e.stopPropagation();
    const newMargin = parentComment.style.marginLeft + CHILD_MARGIN_LEFT;
    const newComment = getCommentObject({
      text: "",
      id: ID++,
      parentId: parentComment.id,
      childrenIds: [],
      style: {
        marginLeft: newMargin
      },
      isEditable: true,
    })
    const allCommentsWithUpdatedParent = comments.map(comment => {
      if(comment.id === parentComment.id) {
        return {
          ...comment,
          childrenIds: [newComment.id, ...comment.childrenIds]
        }
      }
      return comment;
    })
    setComments([
      newComment,
      ...allCommentsWithUpdatedParent,
    ])

  }
  // Deleting a comment from the comment list 
  const handleDeleteComment = (commentId) => {
    let elementsTobeDeleted = null;
    const comment = comments.find(comment => comment.id === commentId);
    if(!comment) return;
    const allChildren = comment.childrenIds;
    if(!allChildren.element) {
      elementsTobeDeleted = commentId;
    }
    allChildren.forEach(child => {
      handleDeleteComment(child);
    })
   const remainingComments = comments.filter(comment => comment.id !== elementsTobeDeleted);
   setComments(remainingComments);
  }

  const handleSaveComment = (id, value) => {
    const newComments = comments.map(comment => {
      if(comment.id === id) {
        return {
          ...comment,
          text: value,
          isEditable: false,
        }
      }
      return comment;
    })
    setComments(newComments);
  }

  const handleEditComment = (id) => {
    const newComments = comments.map(comment => {
      if(comment.id === id) {
        return {
          ...comment,
          isEditable: true,
        }
      }
      return comment;
    })
    setComments(newComments)
  }

  const parents = comments.filter(comment => comment.parentId === -1); // All top level Comments
  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <label >Add a comment : </label>
        <input value={newTopLevelComment.text} onChange={handleNewTopLevelComment}/>
      </form>
      <div>
        {
          parents.map(parent => {
            return (
                <CommentUI key={parent.id} id={parent.id} comments={comments} onAddChildComment={handleAddChildComment} onDeleteComment={handleDeleteComment} onSaveComment={handleSaveComment} onEditComment={handleEditComment}/>
            )
          })
        }
      </div>
    </div>
  )
}

export default AllComments;