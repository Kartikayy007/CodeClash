import React from "react";
import { useSelector } from 'react-redux';


  


const Assignmentjoined = () => {




    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);



  return (
    <div className=" w-[65%]  mt-[50px] pl-[16px] h-[80vh] " style={{marginLeft: sidebarWidth,transition: 'margin-left 0.3s ease' }}>
      <div>
    <h1 className="text-4xl font-bold mb-5 pt-[30px] text-[#394141] gpa-[10px]">
    Mid-Term Essay
  </h1>
  <div>  
    <span className="mb-1">
    Status: <span >Open</span>
  </span>
  <p className="mb-1">
    <span>Due Date:</span> Nov 17, 11:59 PM
  </p>
  <p className="mb-5">
    <span>Created On:</span> Nov 2, 3:04 PM
  </p></div>
 
</div>
<hr/>
<div className="mb-5 mt-[20px]">
  <h2 className="text-lg font-bold mb-2">
    Description
  </h2>
  <p className="text-gray-700 mb-1 mt-[10px]">
    Write a 900-word essay on the topic *"The Impact of Social Media on Modern Communication."* 
    Your essay should include at least three references and follow MLA formatting guidelines.
  </p>
  <ul className="text-gray-700 list-disc ml-5">
    <li>Minimum Word Count: 900 words</li>
    <li>Formatting Style: MLA</li>
    <li>Include Introduction, Body (with subheadings), and Conclusion</li>
    <li>Submit in the format of a Word document</li>
  </ul>
</div>

<div>
  <h2 className="text-lg font-bold mb-2">
    Attachment
  </h2>
  <ul className="text-blue-500 list-none p-0">
    <li className="mb-1">
      <a href="#" className="underline">
        MLA Formatting Guide (PDF Download)
      </a>
    </li>
    <li>
      <a href="#" className="underline">
        Sample Essay (PDF Download)
      </a>
    </li>
  </ul>
</div>

    </div>
  );
};

export default Assignmentjoined;
