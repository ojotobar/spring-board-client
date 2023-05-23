import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap'
import { FaChevronCircleLeft, FaChevronCircleRight, FaPlusSquare } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Alerts from '../../components/public/Commons/Alerts';
import AltListSkeleton from '../../components/public/Commons/skeletons/AltListSkeleton';
import { useGetStatesQuery } from '../api/stateApi';
import { logout } from '../auth/authSlice';
import State from './State';
import ReactPaginate from 'react-paginate';

const StateAdmin = ({ countryId }) => {
  const [pageNumber, setPageNumber] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
  const {data: states, isLoading, isError, error } = useGetStatesQuery({pageNumber, countryId, searchTerm});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(isError){
      if(error?.status === 401){
        dispatch(logout())
        toast.error('Please re-authenticate to continue');
        navigate('/login', { replace: true })
      }
    }
  }, [error, isError, navigate, dispatch])

  const HandlePageClick = ({ selected: PageNumber }) => {
    setPageNumber(PageNumber + 1)
    setSearchTerm("")
  }

  const content = states?.Data?.length > 0 ? 
  states?.Data?.map( state => (
    <Col key={state?.Id}>
      <State state={state}/>
    </Col>
  )) :
  <Alerts
      heading={`No State Record`} 
      body={`Please refresh the page if you feel this is an error or check back later.`} 
  />

  return (
    <Row className="g-3 y-2 JobCard RemoveSpace">
    <Col style={{margin: '1rem 0 0 0'}}> 
      <Row className="d-flex mb-4 mx-3">
        <h5><strong>States</strong></h5>
        <div class="Border mb-2 w-100"></div>
        <Link to={`/admin/location/state/add`} style={{float: 'right', fontSize: '1.5rem'}}>
            <FaPlusSquare color="#212121"/>
        </Link>
      </Row>     
      {
        isLoading ?
        <AltListSkeleton height='3rem'/> :
        <Row xs={1} sm={1} md={1} lg={2} className="g-3 JobCard">{ content }</Row>
      }
    </Col>

    <ReactPaginate
        previousLabel={<FaChevronCircleLeft color='#212121'/>}
        nextLabel={<FaChevronCircleRight color='#212121'/>}
        breakLabel={"..."}
        pageCount={states?.MetaData.TotalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={1}
        containerClassName={"pagination justify-content-center mt-3"}
        pageClassName={"page-item Pagination"}
        pageLinkClassName={"page-link Pagination"}
        previousClassName={"page-item Pagination"}
        previousLinkClassName={"page-link Pagination"}
        nextClassName={"page-item Pagination"}
        nextLinkClassName={"page-link Pagination"}
        breakLinkClassName={"page-link Pagination"}
        breakClassName={"page-item Pagination"}
        activeClassName="PaginationActive"
        onPageChange={HandlePageClick}
      />
  </Row>
  )
}

export default StateAdmin