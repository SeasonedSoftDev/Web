import React from 'react';
import {
  CardMain,
  CardText,
  CardTitle,
  CardDescription,
  CardHead,
  CardActions,
  CardBody,
} from 'components/custom/card-with-text/styles';
import { TCardWithTextProps } from 'components/custom/card-with-text/types';

const Card = ({
  title,
  description,
  actions,
  children,
  ...props
}: TCardWithTextProps) => (
  <CardMain animation="zoom-in" {...props}>
    <CardHead>
      <CardText>
        <CardTitle>{title}</CardTitle>
        {!!description && <CardDescription>{description}</CardDescription>}
      </CardText>
      {!!actions && <CardActions>{actions}</CardActions>}
    </CardHead>
    <CardBody>{children}</CardBody>
  </CardMain>
);

export default Card;
