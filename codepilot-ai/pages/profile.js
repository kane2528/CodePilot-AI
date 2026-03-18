import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import API from "../utils/api";

export default function Profile() {

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    university: "",
    degree: "",
    cgpa: "",
    graduationYear: "",
    company: "",
    position: "",
    experienceYears: "",
    skills: "",
    languages: "",
    github: "",
    linkedin: "",
    portfolio: "",
    bio: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get('/profile/me');
      const data = res.data.data;
      
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        gender: data.profile?.gender || "",
        dob: data.profile?.dob ? new Date(data.profile.dob).toISOString().split('T')[0] : "",
        email: data.email || "",
        phone: data.profile?.phone || "",
        address: data.profile?.address || "",
        role: data.role || "",
        university: data.university || "",
        degree: data.degree || "",
        cgpa: data.cgpa || "",
        graduationYear: data.graduationYear || "",
        company: data.company || "",
        position: data.position || "",
        experienceYears: data.experienceYears || "",
        skills: data.skills ? data.skills.join(", ") : "",
        languages: data.languages ? data.languages.join(", ") : "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        portfolio: data.portfolio || "",
        bio: data.profile?.bio || "",
        avatar: data.profile?.avatar || ""
      });
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await API.post('/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const newAvatarUrl = res.data.data.avatarUrl;
      setProfile({
        ...profile,
        avatar: newAvatarUrl
      });
      toast.success('Profile image updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        university: profile.university,
        degree: profile.degree,
        cgpa: profile.cgpa,
        graduationYear: profile.graduationYear,
        company: profile.company,
        position: profile.position,
        experienceYears: profile.experienceYears,
        skills: profile.skills ? profile.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        languages: profile.languages ? profile.languages.split(",").map(s => s.trim()).filter(Boolean) : [],
        github: profile.github,
        linkedin: profile.linkedin,
        portfolio: profile.portfolio,
        profile: {
          gender: profile.gender,
          dob: profile.dob || null,
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio
        }
      };

      await API.put('/profile/update', payload);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto flex items-center justify-center h-screen pb-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Profile Settings
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 flex flex-col gap-10"
        >

{/* PROFILE HEADER */}

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold uppercase overflow-hidden shrink-0 border-2 border-white/20">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>{profile.firstName?.charAt(0) || ''}{profile.lastName?.charAt(0) || ''}</>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Profile Photo
              </h2>
              <p className="text-gray-400 text-sm mb-3">
                Upload a professional picture
              </p>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                <button 
                  type="button" 
                  disabled={uploadingImage}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${uploadingImage ? 'bg-white/10 text-gray-400' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      Choose File
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

{/* BASIC INFO */}

          <section className="grid grid-cols-2 gap-6">

            <Input label="First Name" name="firstName" value={profile.firstName} onChange={handleChange}/>
            <Input label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange}/>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Gender</label>
              <select 
                name="gender" 
                value={profile.gender}
                onChange={handleChange}
                className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none [&>option]:bg-gray-900"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <Input label="Date of Birth" type="date" name="dob" value={profile.dob} onChange={handleChange}/>

          </section>

{/* CONTACT */}

          <section className="grid grid-cols-2 gap-6">

            <Input label="Email" name="email" value={profile.email} onChange={handleChange} disabled={true}/>
            <Input label="Phone Number" name="phone" value={profile.phone} onChange={handleChange}/>

            <Input label="Address" name="address" value={profile.address} onChange={handleChange} className="col-span-2"/>

          </section>

{/* EDUCATION */}

          <section className="grid md:grid-cols-2 gap-6">

            <Input label="University / College" name="university" value={profile.university} onChange={handleChange} placeholder="e.g. Stanford University"/>
            <Input label="Degree" name="degree" value={profile.degree} onChange={handleChange} placeholder="e.g. B.S. Computer Science"/>

            <Input label="CGPA / Marks" name="cgpa" type="number" step="0.01" min="0" max="100" value={profile.cgpa} onChange={handleChange} placeholder="e.g. 3.8 or 85"/>
            <Input label="Graduation Year" name="graduationYear" type="number" min="1950" max="2100" value={profile.graduationYear} onChange={handleChange} placeholder="e.g. 2024"/>

          </section>

{/* EXPERIENCE */}

          <section className="grid md:grid-cols-2 gap-6">

            <Input label="Company" name="company" value={profile.company} onChange={handleChange} placeholder="e.g. Google"/>
            <Input label="Position" name="position" value={profile.position} onChange={handleChange} placeholder="e.g. Frontend Engineer"/>

            <Input label="Years of Experience" name="experienceYears" type="number" min="0" max="50" step="0.5" value={profile.experienceYears} onChange={handleChange} placeholder="e.g. 2.5"/>

          </section>

{/* SKILLS */}

          <section className="grid md:grid-cols-2 gap-6">

            <TagInput label="Skills" name="skills" value={profile.skills} onChange={handleChange} placeholder="e.g. React, UI/UX (Press Enter)"/>
            <TagInput label="Programming Languages" name="languages" value={profile.languages} onChange={handleChange} placeholder="e.g. JavaScript, Python (Press Enter)"/>

          </section>

{/* SOCIAL LINKS */}

          <section className="grid grid-cols-2 gap-6">

            <Input label="GitHub" name="github" value={profile.github} onChange={handleChange}/>
            <Input label="LinkedIn" name="linkedin" value={profile.linkedin} onChange={handleChange}/>

            <Input label="Portfolio Website" name="portfolio" value={profile.portfolio} onChange={handleChange}/>

          </section>

{/* BIO */}

          <section>

            <label className="text-sm text-gray-300">Short Bio</label>

            <textarea
              name="bio"
              rows="3"
              value={profile.bio}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
            />

          </section>

{/* SAVE BUTTON */}

          <div className="flex justify-end">

            <button 
              disabled={saving}
              className={`px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${saving ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.03]'}`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Profile"}
            </button>

          </div>

        </form>

      </div>

    </Layout>
  );
}

function Input({ label, name, value, onChange, type="text", className="", disabled=false, min, max, step, placeholder }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={`p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none placeholder:text-gray-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

function TagInput({ label, name, value, onChange, placeholder }) {
  const [inputValue, setInputValue] = useState("");
  
  const tags = value ? value.split(",").map(t => t.trim()).filter(Boolean) : [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/,/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      onChange({ target: { name, value: newTags.join(", ") } });
    }
    setInputValue("");
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, idx) => idx !== indexToRemove);
    onChange({ target: { name, value: newTags.join(", ") } });
  };

  return (
    <div className={`flex flex-col gap-2`}>
      <label className="text-sm text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-2 mb-1">
        {tags.map((tag, index) => (
          <span key={index} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="hover:text-white transition-colors focus:outline-none">&times;</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:outline-none placeholder:text-gray-600"
      />
    </div>
  );
}