import { create } from "zustand";
import { FormInstance, message } from "antd";
import { request } from "../request";
import { NavigateFunction } from "react-router-dom";

function getData<T>(url : string){
   const params = new URLSearchParams(window.location.search);
   const page = params.get("page") || 1;
  interface DataInterface {
    data : T[],
    total : number ,
    photo : string | null ,
    portPhoto : string | null ,
    portPhotoType : string | null ,
    selected : string | null ,
    search : string ,
    loading : boolean,
    totalPaginate : number ,
    active : number ,
    isModalOpen : boolean ,
    page: number;
    handlePage: (page: number, navigate: NavigateFunction) => void;
    getData : ()=> void ,
    handleOk : (form : FormInstance)=>void,
    editData : ( id : string , form : FormInstance)=>void,
    deleteData : ( id : string)=>void,
    setActive : ( active : number)=>void,
    showModal : (form : FormInstance)=>void,
    handleCancel : ()=>void,
    SerachSkills : (e : React.ChangeEvent<HTMLInputElement>)=>void,
    handlePhoto : ( file : FormData | undefined )=>void,
    handlePortfoliosPhoto : ( file : FormData | undefined )=>void
  }
  return create<DataInterface>()((set , get) => ({
    data : [],
    total : 0 ,
    photo : null ,
    portPhoto : null ,
    portPhotoType : null ,
    selected : null ,
    search : "" ,
    loading : false,
    totalPaginate : 1 ,
    active : 1 ,
    page: +page,
    isModalOpen : false ,
    handlePage: (page, navigate) => {
      const { search, getData } = get();
      set({ page });
      getData();

      const query = new URLSearchParams();

      query.append("page", page.toString());
      query.append("search", search);

      navigate(`/${url}?` + query);
    },
    getData : async ()=> {
      const {search , active} = get()
      const params = {
        search : search ,
        page : active ,
        limit : 10,
      }
      try {
        set((state)=>({...state , loading : true}))
        const {data} = await request.get(url ,{params})
        set((state)=>({...state , data :data.data , total : data.pagination.total , totalPaginate : Math.ceil(data.pagination.total / 6) }))
      } catch (err) {
        message.error("Server bilan hatolik !")
      } finally {
        set((state)=>({...state , loading : false}))
      }
    } ,
    handleOk : async (form)=>{
      const {selected , getData} = get()
      const oldValues = await form.validateFields()
      let values = get().photo ? {...oldValues , photo : get().photo} : {...oldValues}
      values = get().portPhoto ? {...values , photo : get().portPhoto} : {...values}
      console.log(values);
      
      try {
        if (selected === null) {
          await request.post(url , values)
          getData()
          set((state)=>({...state , isModalOpen : false}))
        } else {
          await request.put(`${url}/${selected}` , values)
          getData()
          set((state)=>({...state , isModalOpen : false}))
        }
      } catch (err) {
        message.error("No information added!")
      }
    },
    editData : async (id , form)=>{
      const {data} = await request.get(`${url}/${id}`)
      const values = data.endDate ? {...data , endDate:data.endDate.split("T")[0] , startDate:data.startDate.split("T")[0]} : {...data}
      // console.log(`${values.photo._id}.${values.photo.name}`);
      const orgPhoto = values.photo ? values.photo._id ? `${values.photo._id}.${values.photo.name.split(".")[1]}` : values.photo : null
      {
        values.photo ? set((state)=>({...state , photo : orgPhoto})) : set({})
      }
      
      // set((state)=>({...state , photo : values?.photo}))
      form.setFieldsValue(values)
      set((state)=>({...state , selected : id , isModalOpen : true}))
    },
    deleteData : async (id)=>{
      const deleteConfirm = confirm("deleted")
      if (deleteConfirm) {
        await request.delete(`${url}/${id}`)
        get().getData()
      }
    },
    setActive : (active)=>{
      set((state)=>({...state , active}))
      get().getData()
    },
    showModal : (form)=>{
      form.resetFields()
      set((state)=>({...state , selected : null , photo : null , isModalOpen : true}))
    },
    handleCancel : ()=>{
      set((state)=>({...state , isModalOpen : false , selected : null}))
    },
    SerachSkills : (e)=>{      
      set((state)=>({...state , search : e.target.value}))
      get().getData()
    },
    handlePhoto : async (file)=>{
      const {data : photo} = await request.post("upload" , file)
      const userPhoto = `${photo._id}.${photo.name.split(".")[1]}`      
      set((state)=>({...state , photo : userPhoto}))
    },
    handlePortfoliosPhoto : async (file) => {
      const {data : photo} = await request.post("upload" , file)
      const userPhoto = `${photo._id}.${photo.name.split(".")[1]}`      
      set({portPhoto : photo._id , photo : userPhoto , portPhotoType : photo.name.split(".")[1] })
    },
  }))
}

export default getData