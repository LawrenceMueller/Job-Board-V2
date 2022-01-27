import generalBtnStyles from '../styles/GeneralBtn.module.css';

function GeneralBtn({ btnFunction, name }) {
  return (
    <button onClick={btnFunction} className={generalBtnStyles.btn}>
      {name}
    </button>
  );
}

export default GeneralBtn;
