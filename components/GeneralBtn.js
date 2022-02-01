import generalBtnStyles from '../styles/GeneralBtn.module.css';

function GeneralBtn({ btnFunction, name, submitFlag }) {
  return (
    <button
      type={submitFlag}
      onClick={btnFunction}
      className={generalBtnStyles.btn}
    >
      {name}
    </button>
  );
}

export default GeneralBtn;
