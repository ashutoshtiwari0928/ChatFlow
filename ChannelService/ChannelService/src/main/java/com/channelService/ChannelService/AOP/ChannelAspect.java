package com.channelService.ChannelService.AOP;


import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@Aspect
public class ChannelAspect {
    private static final Logger logger = LoggerFactory.getLogger(ChannelAspect.class);
    //return type
    //class name
    //method name
    //arguments
    @Before("execution(* com.channelService.ChannelService.Controller.*.*(..)) " +
            "|| execution(* com.channelService.ChannelService.Service.*.*(..))")
    public void logMethodCall(JoinPoint joinPoint) {
        logger.info(
                "Entering function {}.{} with args = {}",
                joinPoint.getTarget().getClass(),
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs())
        );
    }
    @After("execution(* com.channelService.ChannelService.Controller.*.*(..)) " +
            "|| execution(* com.channelService.ChannelService.Service.*.*(..))")
    public void logMethodEnd() {
        logger.info("Method End");
    }
    @AfterReturning("execution(* com.channelService.ChannelService.Controller.*.*(..)) " +
            "|| execution(* com.channelService.ChannelService.Service.*.*(..))")
    public void returnMethod(){
        logger.info("No exception");
    }
    @AfterThrowing("execution(* com.channelService.ChannelService.Controller.*.*(..)) " +
            "|| execution(* com.channelService.ChannelService.Service.*.*(..))")
    public void throwMethod(){
        logger.info("Exception occured");
    }
}
