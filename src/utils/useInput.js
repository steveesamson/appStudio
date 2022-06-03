import { makeReactive } from './reactive.js';
import { useValidation } from './useValidation';

class UseInput {
  constructor(props) {
    this.props = props;
    this.state = {
      name: props.name,
      value: props.value || '',
      error: '',
      silentError: '',
      graph: null,
      newDocs: [],
      delDocs: [],
    };

    makeReactive(this);
    this.validator = useValidation(props, this.setError.bind(this));
  }

  setState(s) {
    this.state = {
      ...this.state,
      ...s,
    };

    this.fireEvent('change', this);
  }

  setValue(val) {
    this.setState({
      value: val,
    });
    this.validator.validate(val);
  }

  reset(val) {
    this.setState({
      ...this.state,
      value: val,
      error: null,
      silentError: null,
      graph: null,
      delDocs: [],
      newDocs: [],
    });
  }
  setError(e, skip) {
    // console.log('error: ', e);
    this.setState(
      skip
        ? {
            silentError: e,
          }
        : {
            error: e,
          },
    );
  }

  validate(skip) {
    this.validator.validate(this.state.value, skip);
  }

  onEdit(e) {
    e.preventDefault();
    props.editMode.onEdit();
  }

  onRemove(e) {
    e.preventDefault();
    props.editMode.onRemove();
  }

  onKeyDown(e) {
    props.onKeyDown && props.onKeyDown(e);
  }

  setObjectValue(vob) {
    this.setState(vob);
    this.validator.validate(vob.value);
  }
  setDelDocs(doc) {
    this.setState({ delDocs: [...this.state.delDocs, doc] });
  }

  setNewDocs(doc) {
    this.setState({ newDocs: [...this.state.newDocs, doc] });
  }
}
export const useInput = function (props) {
  return new UseInput(props);
};
