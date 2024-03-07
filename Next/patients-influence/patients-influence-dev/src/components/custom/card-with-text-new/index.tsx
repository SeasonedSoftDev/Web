import React from 'react';
import {
  CardMain,
  CardText,
  CardTitle,
  CardDescription,
  CardHead,
  CardActions,
  CardBody,
} from 'components/custom/card-with-text-new/styles';
import { TCardWithTextProps } from 'components/custom/card-with-text-new/types';

const Card = ({
  title,
  description,
  actions,
  children,
  headerColumnTable,
  ...props
}: TCardWithTextProps) => (
  <CardMain animation="zoom-in" {...props}>
    <CardHead>
      <CardText>
        <CardTitle>{title}</CardTitle>
        {!!description && <CardDescription>{description}</CardDescription>}
      </CardText>
      {!!actions && <CardActions>{actions}</CardActions>}
      {headerColumnTable}
    </CardHead>
    <CardBody>{children}</CardBody>
  </CardMain>
);

export default Card;
