import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header";

const CreateGroup = () => {
  const { name: currentUsername, id } = useContext(UserContext);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [usernameInput, setUsernameInput] = useState("");
  const [members, setMembers] = useState([currentUsername]);
  const navigate = useNavigate();

  const { groupId } = useParams();
  const isEdit = groupId !== undefined && groupId !== null;

  useEffect(() => {
    const fetchCurrInfo = async () => {
      if (isEdit) {
        const res = await axios.get("http://localhost:4000/group/" + groupId, {
          withCredentials: true,
        });
        const { name, description, status, members } = res.data;
        setGroupName(name);
        setDescription(description);
        setStatus(status);
        setMembers(members);
      }
      if (currentUsername === undefined || currentUsername === null) {
        navigate("/login");
      }
    };
    setMembers([currentUsername]);
    fetchCurrInfo();
  }, [currentUsername]);

  useEffect(() => {
    if (currentUsername === undefined || currentUsername === null) {
      navigate("/login");
    }
  }, [navigate]);

  const addMember = async () => {
    const trimmed = usernameInput.trim();

    if (!trimmed || members.includes(trimmed) || trimmed === currentUsername) {
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:4000/check-username/${trimmed}`
      );
      const { exists } = res.data;

      if (exists) {
        setMembers([...members, trimmed]);
        setUsernameInput("");
      } else {
        alert("Username does not exist!");
      }
    } catch (err) {
      console.error("Error checking username:", err);
      alert("Failed to validate username.");
    }
  };

  const removeMember = (username) => {
    if (username !== currentUsername) {
      setMembers(members.filter((m) => m !== username));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(e);
    if (isEdit) {
      try {
        await axios.patch(
          `http://localhost:4000/group/${groupId}/update`,
          {
            name: groupName,
            description,
            status,
            members,
            createdBy: currentUsername,
          },
          { withCredentials: true }
        );
        navigate("/dashboard");
      } catch (err) {
        console.error("Error updating group:", err);
        if (err.response && err.response.data) {
          alert(err.response.data.message || "Failed to update group.");
        } else {
          alert("An error occurred while updating the group.");
        }
        return;
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:4000/create-group",
          {
            name: groupName,
            description,
            status,
            members,
            createdBy: currentUsername,
          },
          { withCredentials: true }
        );
        // console.log("Group created successfully:", res.data);
        navigate("/dashboard");
      } catch (err) {
        console.error("Error creating group:", err);
        if (err.response && err.response.data) {
          alert(err.response.data.message || "Failed to create group.");
        } else {
          alert("An error occurred while creating the group.");
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center bg-amber-600">
      <Header />
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-teal-700">
          Create a New Group
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Settled">Settled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Add Member by Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Enter username"
              />
              <button
                type="button"
                onClick={addMember}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-500 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {members.map((member) => (
                <div
                  key={member}
                  className="flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                >
                  {member}
                  {member !== currentUsername && !isEdit && (
                    <button
                      onClick={() => removeMember(member)}
                      className="text-red-500 hover:text-red-700 font-bold"
                      title="Remove"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-500 transition-colors"
            >
              {isEdit ? "Update Group" : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
