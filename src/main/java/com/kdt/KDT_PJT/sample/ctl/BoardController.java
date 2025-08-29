package com.kdt.KDT_PJT.sample.ctl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/board")
public class BoardController {
	
	// log 사용을 위함
	private final Logger log = LoggerFactory.getLogger(getClass());
	
	@GetMapping("/")
	public String boardMain(HttpServletRequest request
						   , Model model) {
		
		
		log.info("boardMain >>>> Called INFO");
		log.debug("boardMain >>>> Called Debug");
						

		return "/board/board";

	}

}
