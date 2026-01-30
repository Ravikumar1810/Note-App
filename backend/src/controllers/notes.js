
const Note = require("../models/notes")

const createNotes = async (req, res)=>{
    try
    {
    const {title, description} = req.body  
        if(!title || ! description){
            return res.status(400).json({
                success:false,
                message: "All fields are requireds "
            });
        }
        const  existingNotes = await Note.findOne({
            userId:req.user._id ,
             title
            });
        if(existingNotes){

            return res.status(400).json({
                success:false,
                message:"You can't create the two notes with same Title"
            })
        }
       const newNote =  await Note.create({
            userId : req.user._id,
            title,
            description
       });

       return res.status(201).json({
        success:true,
        message:"Notes created successfully",
        data:newNote
       });

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:err.message
        });
    }
}






const deleteNotes  =  async (req,res)=>{
    try{
    const {id} =  req.params;
     const findNotes = await Note.findByIdAndDelete({
        _id:id,
        userId:req.user._id
     });

     if(!findNotes){
        return res.status(404).json({
            success:false,
            message:"Note not found"
        });
     }

     return res.status(200).json({
        success:true,
        message:"Notes deleted successfuly"
     });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"internal server error",
            error:err.message
        });
    }
}





const  updateNotes  =  async(req, res)=>{
    try
    {
        const {id} = req.params;

     const updatedNote  =  await Note.findByIdAndUpdate({_id:id , userId:req.user._id} , 
        {$set:req.body},
        {new :true , runValidators:true}
     );

     if(!updatedNote ){
        return res.status(404).json({
            success:false,
            message:'Note not found or not authorized'
        });
     }

     return res.status(200).json({
        success:true,
        message:"Notes  updated successfully"
     });
    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}






// get all notes by user 



const getAllNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    let limit = parseInt(req.query.limit) || 6;
    let page = parseInt(req.query.page) || 1;

    const MAX_LIMIT = 50;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
    if (limit < 1) limit = 6;
    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    const findnotes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    return res.status(200).json({
      success: true,
      message: findnotes.length === 0 
        ? "No notes found" 
        : "Notes fetched successfully",
      data: findnotes
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};






// view page 

const  viewnote  = async(req, res)=>{
    try
    {
        const {id} =  req.params;
     const  findnote  =  await Note.findById({
            _id:id,
            userId:req.user._id
    });
    if(!findnote)
    {
        return res.status(404).json({
            success:false,
            message:"Note not found or not authorized "
        });
    }


    return res.status(200).json({
        success:true,
        message:"Note fetched successfully",
        data:findnote
    })


    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}





module.exports = {createNotes , updateNotes , deleteNotes , getAllNotes , viewnote}






















