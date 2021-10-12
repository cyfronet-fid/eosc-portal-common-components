import PropTypes from "prop-types";

export default function usePropTypes(initialProps, WrappedComponent) {
  let props = initialProps;
  if (WrappedComponent.propTypes && Object.keys(WrappedComponent.propTypes).length > 0) {
    if (WrappedComponent.defaultProps) {
      props = { ...WrappedComponent.defaultProps, ...props };
    }
    PropTypes.checkPropTypes(WrappedComponent.propTypes, props, "prop", WrappedComponent.name);
  }

  return props;
}
