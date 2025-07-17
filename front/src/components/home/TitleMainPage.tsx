import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {Card, Text, Image, CardSection, Badge, Group, Button, Paper, Container, Title} from '@mantine/core';
import "../../styles/home/components/TitleMainPage.module.css";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

export default function TitleMainPage() {
    return (
        <div className="title-main-page">
            <Text className={"title"}>
                Bienvenue sur Blind-Blind!
            </Text>
        </div>
    );
}
