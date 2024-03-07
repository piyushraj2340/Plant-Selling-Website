import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewTabSectionAsync, setIsCurrentTab } from '../nurserySlice';

const NurseryTabs = () => {
    const nursery = useSelector(state => state.nursery.nursery);
    const nurseryStore = useSelector(state => state.nursery.nurseryStore);
    const isCurrentTab = useSelector(state => state.nursery.isCurrentTab);
    const dispatch = useDispatch();

    const toggleTabSection = useRef("");

    useEffect(() => {
        /*
            * When Click on the Add New Section button
            * An Input field will open on the same place with floating add buttons on the right.
            * if the user click anywhere on the screen the input filed will change back to button.
        */
        const handelUndoTabSelection = (event) => {
            if (toggleTabSection.current && !toggleTabSection.current.contains(event.target)) {
                setTabs("Add New Section");
            }
        }

        document.addEventListener('click', handelUndoTabSelection);

        return () => {
            document.removeEventListener('click', handelUndoTabSelection);
        }
    }, []);

    const [tabs, setTabs] = useState("Add new section");

    const handelAddNewSection = async () => {
        const contentInit = {
            user: nursery.user,
            nursery: nursery._id,
            tabName: tabs,
            renders: []
        }

        if (tabs !== "") {
            if (nurseryStore.some(content => content.tabName.toLocaleLowerCase() === tabs.toLocaleLowerCase())) {
                alert("New Section is already exist.");
            } else {
                dispatch(addNewTabSectionAsync(contentInit))
            }
        } else {
            alert("New Section is required.");
        }
    }


    const handelEnterKeyAddNewSection = (event) => {
        if (event.key === "Enter") {
            handelAddNewSection();
            setTabs("")
        }
    }

    return (
        <div className="nav-tab border-bottom border-black py-2 mb-3 d-flex flex-wrap justify-content-start">
            <button className={`btn btn-tab bg-light mt-2 ${isCurrentTab === "info" && "viewing border-black"}`} onClick={() => { dispatch(setIsCurrentTab("info")) }}>Nursery Info</button>

            {
                nurseryStore.map((content, index) => {
                    return <button key={index} className={`btn btn-tab bg-light mt-2 ${isCurrentTab === content.tabName && "viewing border-black"}`} onClick={() => dispatch(setIsCurrentTab(content.tabName))}>{content.tabName}</button>
                })
            }

            <span ref={toggleTabSection} className='btn btn-tab d-flex align-items-center btn bg-light p-0 m-0 btn-to-input-container' onClick={() => { setTabs("") }}>
                <input type={tabs.toLocaleLowerCase() !== "add new section" ? "text" : "button"} className={`btn-to-input btn text-start`} placeholder='Add New Section' onChange={(e) => setTabs(e.target.value)} value={tabs} onKeyDown={handelEnterKeyAddNewSection} />
                {tabs.toLocaleLowerCase() !== "add new section" && <button className="btn btn-info m-0 d-flex align-items-center justify-content-center" onClick={handelAddNewSection}><i className='material-symbols-outlined'>add</i></button>}
            </span>
        </div>
    )
}

export default NurseryTabs