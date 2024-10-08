"use client"
import React, { useEffect, useState } from 'react'
import AppLayout from '@component/layouts/appLayout'
import AppCard from '@/app/components/organisms/AppCard'
import Link from 'next/link'
import AppInput from '@/app/components/organisms/AppInput'
import { fetchStaffs, staffsSummary, suspendStaffs, unsuspendStaffs } from '@/app/services/authService'
import { TbEye } from 'react-icons/tb'
import Modal from '@/app/components/organisms/Modal'
import serialize from '@/app/hooks/Serialize'
import { BsCamera } from 'react-icons/bs'
import Image from 'next/image'
import axios from 'axios'
import { API_BASE_URL, TOKEN } from '@/app/services/httpService'
import ResponseModal from '@/app/components/organisms/ResponseModal'
import TopUsers from '@/app/components/organisms/TopUsers'
import { debounce } from '@/app/hooks/useDebounce'

function Page() {
  const [summary, setSummary] = useState([])
  const [selectedImage, setSelectedImage] = useState();
  const [addStaff, setAddStaff] = useState(false)
  const [errors, setErrors] = useState({})

  const [catego, setcate] = useState(["", "", "", "", "", "", "", "", "", "", ""])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [x, setX] = useState({})
  const headers = { 'Authorization': TOKEN }
  const [alertMsg, setAlert] = useState(false)
  const [alertMsgData, setAlertData] = useState(false)

  const fetch = async () => {
    const { status, data } = await fetchStaffs().catch(err => console.log(err))
    if (status) {
      setcate(data.data);
    }
    fetchSummary()
    setLoading(false)
  }

  const uploadImg = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  }


  const updateStatus = async (e) => {
    e.preventDefault();
    const val = serialize(e.target)
    setProcessing(true)
    if (val.status === "active") {
      const { status, data } = await suspendStaffs(val).catch(err => console.log(err))
      if (status) {
        fetch()
        setX({})
      }
      setAlert(true)
      setAlertData(data)
    } else {
      const { status, data } = await unsuspendStaffs(val).catch(err => console.log(err))
      if (status) {
        fetch()
        setX({})
      }
      setAlert(true)
      setAlertData(data)
    }
    setProcessing(false)
  }



  const addNow = async (e) => {
    e.preventDefault();
    const data = serialize(e.target)
    const staffData = new FormData()
    setProcessing(true)
    staffData.append('image', selectedImage)
    staffData.append('name', data.name)
    staffData.append('email', data.email)
    staffData.append('phone', data.phone)
    await axios.post(`${API_BASE_URL}admin/staff/add`, staffData, { headers }).then(async (res) => {
      await fetch()
      setSelectedImage()
      setAddStaff(false)
      setAlert(true)
      setAlertData(res.data)
    }).catch((error) => {
      error.response && setErrors(error.response.data.data);
      setAlert(true)
      error.response && setAlertData(error.response.data)
    })
    setProcessing(false)
  }



  const searchFN = debounce(async (e) => {
    const { status, data } = await fetchStaffs({ search: e }).catch(err => console.log(err))
    if (status) {
      setcate(data.data);
    }
  }, 3000);


  const fetchSummary = async () => {
    const { status, data } = await staffsSummary().catch(err => console.log(err))
    if (status) {
      setSummary(data.data);
    }
  }

  useEffect(() => {
    fetchSummary()
    fetch()
  }, [])

  return (
    <AppLayout title={"Summary of Mbwoy staffs"}>
      <Modal closeModal={() => { setAddStaff(false) }} size={"lg"} isOpen={addStaff}>
        <form onSubmit={(e) => { addNow(e) }} >
          <div className='space-y-5'>
            <div className="h-24 w-24 rounded-full bg-gray-200 relative">
              {selectedImage && (
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Thumb"
                  className="w-full h-full rounded-full"
                  width={'150'}
                  height={'150'}
                />
              )}
              <div onClick={() => document.querySelector('#img').click()} className="absolute flex items-center justify-center w-8 h-8 bg-black border-2 border-white rounded-full bottom-0 right-0 cursor-pointer text-white">
                <BsCamera />
              </div>
              <input name="image" required id="img" onChange={(e) => uploadImg(e)} type="file" className="opacity-0" accept="image/png, image/gif, image/jpeg" />
            </div>
            <AppInput name="name" required label="Name" />
            <AppInput name="email" required label="Email" type="email" />
            <AppInput name="phone" required label="Phone" type="tell" />
            <div className='flex gap-4 items-center'>
              <button disabled={processing} className='bg-black disabled:bg-opacity-30 text-white text-center flex-grow rounded-md py-2'>{processing ?"Confirming..." : "Confirm"}</button>
              <div onClick={() => { setAddStaff(false) }} className='hover:bg-gray-50 text-center flex-grow rounded-md py-2 cursor-pointer'>Cancel</div>
            </div>
          </div>
        </form>
      </Modal>
      {
        Object.keys(x).length > 0 && (
          <Modal closeModal={() => setX({})} size={"sm"} isOpen={Object.keys(x).length > 0}>
            <form onSubmit={(e) => { updateStatus(e) }} >
              <div className='space-y-5'>

                <div className="">
                  <div className="grid grid-cols-2">
                    <div className=''>
                      <div className='font-bold'>Name:</div>
                      <div className='text-gray-500'>{x?.name}</div>
                    </div>
                    <div className=''>
                      <div className='font-bold'>Email:</div>
                      <div className='text-gray-500'>{x?.email}</div>
                    </div>
                    <div className=''>
                      <div className='font-bold'>Phone:</div>
                      <div className='text-gray-500'>{x?.phone}</div>
                    </div>
                    <div className=''>
                      <div className='font-bold'>Gender:</div>
                      <div className='text-gray-500'>{x?.gender}</div>
                    </div>
                    <div className=''>
                      <div className='font-bold'>Referral by:</div>
                      <div className='text-gray-500'>{x?.referral_by}</div>
                    </div>
                    <div className=''>
                      <div className='font-bold'>Status:</div>
                      <div className='text-gray-500'>{x?.status}</div>
                    </div>
                    <div className=''>
                      <div className='font-bold'>Address:</div>
                      <div className='text-gray-500'>{x?.address}</div>
                    </div>
                  </div>
                </div>
                <input type='hidden' value={x.id} name='id' />
                <input type='hidden' value={x.status} name='status' />
                <div className='flex gap-4 items-center'>
                  <button disabled={processing} className='bg-black disabled:bg-opacity-30 text-white text-center flex-grow rounded-md py-2'>{processing ? "Updating..." : x.status === "active" ? "Suspend" : "Activate"}</button>
                  <div onClick={() => setX({})} className='hover:bg-gray-50 text-center flex-grow rounded-md py-2 cursor-pointer'>Cancel</div>
                </div>
              </div>
            </form>
          </Modal>
        )
      }
      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <AppCard figure={summary?.active} icon={<i className="ri-user-star-line"></i>} color="text-[#13f444]" text="Total Active Staffs" bg="bg-[#13f444]" />
            <AppCard figure={summary?.suspended} icon={<i className="ri-user-forbid-line"></i>} color="text-[#ef4444]" text="Total Suspended Staffs" bg="bg-[#ef4444]" />
          </div>
          <div className="space-y-5">
            <div className="flex">
              <div className="flex-grow">
                <div className="max-w-sm">
                  <AppInput name="search" onChange={(e) => searchFN(e.target.value)} required label="Search by Name and Email" />
                </div>
              </div>
              <div onClick={() => { setAddStaff(true) }} className="bg-black text-white py-3 font-bold px-6 text-sm rounded-md cursor-pointer">Add Staff</div>
            </div>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='bg-black px-3 py-2 rounded-l-lg text-left text-white' scope="">Username</th>
                  <th className='bg-black px-3 py-2 text-left text-white hidden sm:table-cell' scope="">Phone</th>
                  <th className='bg-black px-3 py-2 text-left text-white hidden lg:table-cell' scope="">Referral by</th>
                  <th className='bg-black px-3 py-2 rounded-r-lg text-left hidden sm:table-cell text-white' scope="">Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  !loading && catego.map((data, i) => (
                    <tr className='odd:bg-white' key={i}>
                      <td className='px-3 py-2 text-[10px] text-left flex' scope="">
                        <div className="flex-grow flex items-center gap-2">
                          <div className="">
                            <div className="w-8 bg-gray-100 rounded-full h-8"></div>
                          </div>
                          <div className="">
                            <div className="font-bold">{data.name}</div>
                            <div className="text-xs text-gray-400">{data.email}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end sm:hidden gap-2">
                          <div className="flex-grow">
                            <div className={`text-[9px] px-3 inline py-[2px] rounded-lg bg-opacity-10 ${data.status === "active" ? "text-success bg-success" : "text-danger bg-danger"}`}>{data.status}</div>
                          </div><div onClick={() => { setX(data) }} className="w-7 h-7 cursor-pointer rounded-md text-black flex items-center justify-center bg-gray-200 "><TbEye /></div>
                        </div>
                      </td>
                      <td className='px-3 py-2 text-left hidden sm:table-cell' scope="">{data.phone}</td>
                      <td className='px-3 py-2 text-left hidden lg:table-cell' scope="">{data?.referral_by}</td>
                      <td className='px-3 py-2 text-left hidden sm:table-cell' scope="">
                        <div className="flex items-center gap-3">
                          <div className="flex-grow">
                            <div className={`text-[9px] px-3 inline py-[2px] rounded-lg bg-opacity-10 ${data.status === "active" ? "text-success bg-success" : "text-danger bg-danger"}`}>{data.status}</div>
                          </div> <div onClick={() => { setX(data) }} className="w-7 h-7 cursor-pointer rounded-md text-black flex items-center justify-center bg-gray-200 "><TbEye /></div>
                        </div>
                      </td>
                    </tr>
                  ))
                }

                {
                  loading && ["", "", "", "", "", ""].map((data, i) => (
                    <tr className='odd:bg-white' key={i}>
                      <td className='px-3 py-2 text-[10px] text-left flex' scope="">
                        <div className="flex-grow flex items-center gap-2">
                          <div className="">
                            <div className="w-8 bg-gray-100 preload rounded-full h-8"></div>
                          </div>
                          <div className="w-full space-y-2">
                            <div className="font-bold preload py-2 w-1/3"></div>
                            <div className="text-xs text-gray-400 preload py-1 w-2/3"></div>
                          </div>
                        </div>
                      </td>
                      <td className='px-3 py-2 text-left hidden sm:table-cell' scope="">
                        <div className="preload py-2 w-2/3"></div>
                      </td>
                      <td className='px-3 py-2 text-left hidden lg:table-cell' scope="">
                        <div className="preload py-2 w-2/3"></div>
                      </td>
                      <td className='px-3 py-2 text-left hidden sm:table-cell' scope="">
                        <div className="flex items-center gap-3">
                          <div className="flex-grow">
                            <div className={`text-[9px] px-7 inline py-[2px] rounded-lg bg-opacity-10 preload`}></div>
                          </div> <div className="w-7 h-7 preload cursor-pointer rounded-md text-black flex items-center justify-center bg-gray-200 "></div>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="">
          <TopUsers />
        </div>
      </div>
      <ResponseModal
        status={alertMsgData?.success}
        isOpen={alertMsg}
        onClose={() => setAlert(false)}
        message={alertMsgData?.message}
      />
    </AppLayout>
  )
}

export default Page